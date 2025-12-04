
const path = require('path');
const fs = require('fs'); 
const jsonServer = require('json-server'); 
const Formidable = require('formidable');
const uuid = require('uuid');
const PUBLIC_DIR = path.join(__dirname, 'public'); 
const PORT = 3000;
const HOST = '0.0.0.0';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({ static: PUBLIC_DIR }); 

server.delete('/photos/:id', (req, res) => {
    const photoId = req.params.id;
    const db = router.db;
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
server.post('/photos', (req, res) => {
    const form = new Formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd przetwarzania danych formularza.' });
        }
        const url = fields.url ? fields.url[0] : null; 
        const category = fields.category ? fields.category[0] : null; 
        const uploadedFile = files.photo ? files.photo[0] : null;

        if (!uploadedFile || !url || !category) {
            if (uploadedFile && fs.existsSync(uploadedFile.filepath)) {
                 fs.unlinkSync(uploadedFile.filepath);
            }
            return res.status(400).json({ error: 'Brak pliku, nazwy (url) lub kategorii.' });
        }
        const tempPath = uploadedFile.filepath; 
        try {
            const newId = uuid.v4(); 
            const finalFileName = url.endsWith('.jpg') ? url : `${url}.jpg`; 
            const finalPath = path.join(PUBLIC_DIR, finalFileName); 
            fs.copyFileSync(tempPath, finalPath);
            fs.unlinkSync(tempPath); 
            const db = router.db;
            const finalUrlInDb = `/${finalFileName}`;
            
            const newPhotoEntry = {
                id: newId,         
                url: finalUrlInDb, 
                category: category  
            };

            db.get('photos').push(newPhotoEntry).write();
            return res.status(201).json(newPhotoEntry);
        } catch (e) {
            console.error(`[POST] BŁĄD SYSTEMOWY:`, e.code, e.message); 
        }
    });
});
server.use(middlewares); 
server.use(router);      

server.listen(PORT, HOST, () => {
    console.log('JSON Server running na http://%s:%s', HOST, PORT);
});