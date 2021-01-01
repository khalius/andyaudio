const express = require('express');
const app = express();
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'audios')));
app.use(cors({
    origin: 'https://chat.elchat.net'
}));

app.post('/upAudio', multer().single('archivo'), (req, res) => {
    if (req.file.size > 1024 * 1024) return null;
    if (req.file.mimetype !== 'audio/ogg') return null;
    let date = Date.now().toString();
    fs.writeFile(`${path.join(__dirname, 'audios')}/${date}.ogg`, req.file.buffer)
        .then(() => console.log('archivo subido'))
        .catch(err => console.log(err));
    res.send(`${date}.ogg`);
});

app.get('/AndyAudio', (req, res) => {
    res.sendFile(path.join(__dirname, 'lala.js'));
});

app.listen(app.get('port'), () => console.log('Servidor Funcionando en el puerto : ', app.get('port')));