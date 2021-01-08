const express = require('express');
const app = express();
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const publicDir = path.join(__dirname, 'public');
const audiosDir = path.join(__dirname, 'public', 'audios');
const imgsDir = path.join(__dirname, 'public', 'imgs');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
if (!fs.existsSync(audiosDir)) fs.mkdirSync(audiosDir);
if (!fs.existsSync(imgsDir)) fs.mkdirSync(imgsDir);

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'https://chat.elchat.net'
}));

app.post('/upAudio', multer().single('audio'), (req, res) => {
    if (req.file.size > 1024 * 1024) return null;
    if (req.file.mimetype !== 'audio/ogg') return null;
    let date = Date.now().toString();
    fs.writeFile(`${audiosDir}/${date}.ogg`, req.file.buffer)
        .then(() => console.log('Audio subido'))
        .catch(err => console.log(err));
    res.send(`${date}.ogg`);
});

app.post('/upImg', multer().single('image'), (req, res) => {
    if (req.file.size > 1024 * 1024 * 3) return null;
    const regex = /(png|jpg|jpeg|gif)/;
    let searchMimeType = req.file.mimetype.match(regex);
    if (searchMimeType == null) return null;
    let date = Date.now().toString();
    fs.writeFile(`${imgsDir}/${date}.${searchMimeType[0]}`, req.file.buffer)
        .then(() => console.log('Imagen subida'))
        .catch(err => console.log(err));
    res.send(`${date}.${searchMimeType[0]}`);
});

app.get('/AndyAudio', (req, res) => {
    res.sendFile(path.join(__dirname, 'lala.js'));
});

app.listen(app.get('port'), () => console.log('Servidor Funcionando en el puerto : ', app.get('port')));