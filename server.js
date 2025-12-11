const path = require('path');
const fs = require('fs'); 
const jsonServer = require('json-server'); 
const uuid = require('uuid');
const bodyParser = require('body-parser');
const PUBLIC_DIR = path.join(__dirname, 'public'); 
const PORT = 3000;  
const HOST = '0.0.0.0';
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const db = router.db; 
const USERS_DB = db.get('accounts');
const middlewares = jsonServer.defaults({ static: PUBLIC_DIR }); 
server.use(middlewares); 
server.post('/photos',bodyParser.json({ limit: '50mb' }), (req, res) => {
    const { url, category, user_id, base64 } = req.body;
    if (!url || !category || !base64) {
        return res.status(400).json({ error: 'Brakuje danych (url, category, lub base64).' });
    } 
    try {
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = Buffer.from(base64Data, 'base64');
        const finalFileName = url.endsWith('.jpg') ? url : `${url}.jpg`;
        const finalPath = path.join(PUBLIC_DIR, finalFileName); 
        fs.writeFileSync(finalPath, binaryData); 
        const finalUrlInDb = `/${finalFileName}`;
        const newPhotoEntry = {
            id: uuid.v4(),         
            url: finalUrlInDb, 
            category: category,
            user_id: user_id  
        };
        db.get('photos').push(newPhotoEntry).write();
        return res.status(201).json(newPhotoEntry);
    } catch (e) {
        console.error(`[POST] BŁĄD ZAPISU BASE64:`, e.message); 
        return res.status(500).json({ error: 'Błąd serwera podczas zapisu pliku Base64.' });
    }
});
server.post('/auth/login',bodyParser.json(), (req, res) => {
    const { email, password } = req.body;
    const user = USERS_DB.find({ email: email, haslo: password }).value(); 
    if (!user) {
        return res.status(401).json({ message: "Niepoprawny email lub hasło." });
    }
    const access_token = user.id; 
    res.status(200).json({
        token: access_token, 
        user: { 
            id: user.id, 
            email: user.email 
        }
    });
});

server.use((req, res, next) => { 
    if (req.path === '/auth/login' || req.path.startsWith('/quotes') || req.path.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return next();
    }
    if (req.path.startsWith('/accounts') && (req.method === 'POST' || req.method === 'GET')) {
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Brak tokena autoryzacyjnego.' });
    }
    const token = authHeader.split(' ')[1];
    const user = USERS_DB.find({ id: token }).value(); 
    if (!user) {
        return res.status(401).json({ error: 'Token (ID) nieważny lub użytkownik nie istnieje.' });
    }  
    req.userId = user.id; 
    const isUserSpecificResource = req.path.startsWith('/list') || req.path.startsWith('/goals') || req.path.startsWith('/photos');
    if (req.method === 'GET' && req.userId && isUserSpecificResource) {
        req.query.user_id = req.userId;
    }  
    next(); 
});
server.delete('/photos/:id', (req, res) => {
    const photoId = req.params.id;
    const photos = db.get('photos'); 
    const photo = photos.find({ id: photoId }).value(); 
    if (photo && photo.url) {
        const filePath = path.join(PUBLIC_DIR, photo.url); 
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            photos.remove({ id: photoId }).write(); 
            return res.status(204).send();     
        } catch (e) {
            console.error(`Błąd podczas usuwania pliku:`, e.message);
            return res.status(500).json({ error: 'Błąd serwera podczas usuwania pliku.' });
        }
    } else {
        return res.status(404).json({ error: 'Zdjęcie o podanym ID nie istnieje.' });
    }
});
server.use(router);      
server.listen(PORT, HOST, () => {
    console.log('JSON Server running na http://%s:%s', HOST, PORT);
});