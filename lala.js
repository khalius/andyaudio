async function main() {

    const x = chatHTML5;
    const old = x.receiveText;
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const mediaRecorder = new MediaRecorder(stream);
    let state = false;
    let chunks = [];
    let serverPath = `https://andyaudio.herokuapp.com`;
    let serverPathParsed = `//andyaudio.herokuapp.com`;
    let tempUser = { name: '', time: 0 };
    let blackList = [];
    let countEvent = 0;
    let emojiState = false;
    let stickersResponse = await fetch('https://andyaudio.herokuapp.com/stickers.json');
    let stickersResult = await stickersResponse.json();
    console.log(stickersResult);
    let z = /^\[audio\]/i;
    let yt1 = /(www\.)?youtube\.com/i;
    let yt2 = /(www\.)?youtu\.be/i;
    const oldy = x.socket.onevent;
    let stickersArea = `
        <div id="stickersArea" style="width:316px;height:236px;position:relative;top:0;left:0;display:grid;grid-template-columns:1fr 1fr 1fr;overflow-x:hidden;overflow-y:auto;gap:5px;padding:10px;">
        </div>
    `;
    let emojiSelectArea = `<div style="display:flex;width:100%;justify-content:space-around;align-items:center;">
            <p 
            id="emojis"
            style="
            width: 100%;
            text-align: center;
            padding-bottom: 5px;
            margin: 5px 0 0 0;
            cursor:pointer;
            font-weight:bold;
        ">Emojis</p>
            <p 
            id="stickers"
            style="
            width: 100%;
            text-align: center;
            padding-bottom: 5px;
            margin: 5px 0 0 0;
            cursor:pointer;
            font-weight:bold;
        ">Stickers</p>
    </div>`;
    let avatarBtn = `<label style="display:flex;cursor:pointer;font-size:.7em;font-weight:100;margin:6px 10px;color:blueviolet;" for="fileElem">
        <i class="fa fa-picture-o" style="margin-right:5px;"></i>
        Cambiar Avatar
    </label>`;
    let emojiActiveStyles = [
        { borderBottom: '4px solid pink', color: 'pink' },
        { borderBottom: '4px solid steelblue', color: 'steelblue' },
        { borderBottom: 'none', color: 'black' }
    ];
    let falseStyle = { width: '30px', height: '30px', borderRadius: '9999px', background: '#51ce86', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' };
    const audioBtn = `<div id="audioBtn">
        <i class="fa fa-microphone" />
        <p id="audioTxt"></p>
    </div>`;
    const imgBtn = `<div>
        <input type="file" style="display:none;" id="inputImg"  accept="image/*"/>
        <label for="inputImg">
            <i class="fa fa-picture-o" style="margin-left:10px;cursor:pointer;"></i>
        </label>
    </div>`;
    x.forbiddenWords.splice(x.forbiddenWords.indexOf('https'), 1);
    x.emojiArea[0].emojioneArea.canPaste = true;
    $('.emojionearea-picker').css('overflow', 'hidden')
    $('.textarea-icons-wrapper').append(audioBtn);
    $('.textarea-icons-wrapper').append(imgBtn);
    $('.ham-dropdown-list').append(avatarBtn);
    $('.emojionearea-picker').prepend(emojiSelectArea);
    $('.emojionearea-picker').append(stickersArea);
    $('#audioBtn').css(falseStyle);
    $('#emojis').css(emojiActiveStyles[0]);
    x.receiveText = (a, b, c) => {
        let path = b.replace(z, '');
        if (z.test(b)) {
            old.apply(x, [a, `<audio controls src="${serverPath}/audios/${path}"><audio>`, c])
            return;
        }
        if (yt1.test(b)) {
            let code = b.substring(b.match(/(v=)/)['index'] + 2, b.match(/(v=)/)['index'] + 13);
            old.apply(x, [a, `<iframe class="youTubeFrame" width="400" height="250" src="https://www.youtube.com/embed/${code}" frameborder="0" allowfullscreen></iframe>`, c]);
            return;
        }
        if (yt2.test(b)) {
            let code = b.substring(b.length - 11);
            old.apply(x, [a, `<iframe class="youTubeFrame" width="400" height="250" src="https://www.youtube.com/embed/${code}" frameborder="0" allowfullscreen></iframe>`, c]);
            return;
        }
        old.apply(x, [a, b, c])

    }
    $('#fileElem').change(e => x.changeAvatar());
    $('#audioBtn').click(e => {
        if (!state) {
            $('#audioBtn').css({...falseStyle, background: 'tomato' });
            mediaRecorder.start();
            state = true;
        } else {
            $('#audioBtn').css(falseStyle);
            mediaRecorder.stop();
            state = false;
        }
    });
    $('#inputImg').change(e => {
        let file = e.target.files[0];
        if (file.size > 1024 * 1024 * 3) {
            alert('La imágen es muy pesada');
            return null;
        }
        const regex = /(png|jpg|jpeg|gif)/;
        if (!regex.test(file.type)) {
            alert('Solo se aceptan imágenes');
            return null;
        }
        let form = new FormData();
        form.append('image', file);
        $.ajax({
            url: `${serverPath}/upImg`,
            type: 'POST',
            data: form,
            processData: false,
            contentType: false,
            success: response => {
                x.emojiArea[0].emojioneArea.setHTML(`<img class="gif" src="${serverPathParsed}/imgs/${response}"/>`);
                x.sendText();
            },
            error: err => console.log(err)
        });
    });
    $('#emojis').click(e => {
        if (!emojiState) return;
        $('#emojis').css(emojiActiveStyles[0]);
        $('#stickers').css(emojiActiveStyles[2]);
        $('.emojionearea-wrapper').css('display', 'block');
        emojiState = !emojiState;
        return;
    });
    $('#stickers').click(e => {
        if (emojiState) return;
        $('#stickers').css(emojiActiveStyles[1]);
        $('#emojis').css(emojiActiveStyles[2]);
        $('.emojionearea-wrapper').css('display', 'none');
        emojiState = !emojiState;
        return;
    });
    mediaRecorder.ondataavailable = e => {
        chunks.push(e.data);
    }
    mediaRecorder.onstop = e => {
        let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        chunks = [];
        let form = new FormData();
        form.append('audio', blob);
        $.ajax({
            url: `${serverPath}/upAudio`,
            type: 'POST',
            data: form,
            processData: false,
            contentType: false,
            success: response => {
                x.emojiArea[0].emojioneArea.setText(`[audio]${response}`);
                x.sendText();
            },
            error: err => console.log(err)
        });
    }
    x.socket.onevent = function(packet) {
        if (blackList.indexOf(packet.data[1]['username']) !== -1) return null;
        if (packet.data[0] === 'writes') return null;
        if (packet.data[2] && typeof(packet.data[2])) {
            if (packet.data[2].length > 160) {
                blackList.push(packet.data[1]['username']);
                alert('Amenaza neutralizada, siga chateando :)');
                return null;
            }
        }
        if (countEvent >= 4) {
            if ((Date.now() - tempUser['time']) < 300) {
                blackList.push(packet.data[1]['username']);
                alert('Amenaza neutralizada, siga chateando :)');
                console.log(blackList, packet.data[0]);
                $("div.tab-content .tab-pane.active").eq(0)['empty']();
                countEvent = 0;
                return null;
            } else {
                countEvent = 0;
            }
        }
        if (tempUser['name'] === packet.data[1]['username']) {
            countEvent++;
        } else {
            countEvent = 0;
        }
        tempUser = { name: packet.data[1]['username'], time: Date.now() };
        oldy.call(this, packet);
    }

}
main();