const path = require('path');
const fs = require('fs').promises;
const jsonServer = require('json-server');
const uuid = require('uuid');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const db = router.db;
const USERS_DB = db.get('accounts');

const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = 3000;

server.use(jsonServer.defaults({ static: PUBLIC_DIR }));
server.use(jsonServer.bodyParser);

server.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = USERS_DB.find({ email, haslo: password }).value();
    if (!user) return res.status(401).json({ message: "Niepoprawny email lub hasło." });  
    const { id, avatar } = user;
    res.json({ token: id, user: { id, email: user.email, avatar: avatar || null } });
});

server.use((req, res, next) => {
    const isPublic = ['/auth/login', '/quotes'].includes(req.path) || 
                     req.path.match(/\.(jpg|jpeg|png|gif)$/i) ||
                     (req.path.startsWith('/accounts') && (req.method === 'POST' || req.method === 'GET'));

    if (isPublic) return next();
    const token = req.headers.authorization?.split(' ')[1];
    const user = USERS_DB.find({ id: token }).value();
    if (!user) return res.status(401).json({ error: 'Brak lub nieważny token.' });
    req.userId = user.id;
    if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
        req.body.user_id = req.userId;
    }
    if (req.method === 'GET') {
        req.query.user_id = req.userId;
    }
    if (['PATCH', 'DELETE'].includes(req.method) && ['/list', '/goals'].some(p => req.path.startsWith(p))) {
        const resource = req.path.split('/')[1];
        const id = req.path.split('/').pop();
        const item = db.get(resource).find(i => String(i.id) === String(id) && i.user_id === req.userId).value();
        if (!item) return res.status(403).json({ error: 'Brak uprawnień.' });
    }

    next();
});

server.post('/photos', async (req, res) => {
    const { category, base64 } = req.body;
    if (!category || !base64) return res.status(400).json({ error: 'Brakuje danych.' });
    try {
        const fileName = `${uuid.v4()}.jpg`;
        await fs.writeFile(path.join(PUBLIC_DIR, fileName), Buffer.from(base64.split(',')[1] || base64, 'base64'));
        const newPhoto = { id: uuid.v4(), url: `/${fileName}`, category, user_id: req.userId };
        db.get('photos').push(newPhoto).write();
        res.status(201).json(newPhoto);
    } catch (e) {
        res.status(500).json({ error: 'Błąd zapisu.' });
    }
});

server.delete('/photos/:id', async (req, res) => {
    const photo = db.get('photos').find({ id: req.params.id, user_id: req.userId }).value();
    if (!photo) return res.status(404).json({ error: 'Nie znaleziono.' });
    await fs.unlink(path.join(PUBLIC_DIR, path.basename(photo.url))).catch(() => {});
    db.get('photos').remove({ id: req.params.id }).write();
    res.status(204).send();
});

server.use(router);
server.listen(PORT, '0.0.0.0', () => console.log(`Server on port ${PORT}`));