async function main() {

    const x = chatHTML5;
    const old = x.receiveText;
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const mediaRecorder = new MediaRecorder(stream);
    let state = false;
    let chunks = [];
    let stateImg = true;
    let serverPath = `https://andyaudio.herokuapp.com`;
    let falseStyle = { width: '30px', height: '30px', borderRadius: '9999px', background: '#51ce86', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' };
    const audioBtn = `<div id="audioBtn">
        <i class="fa fa-microphone" />
        <p id="audioTxt"></p>
    </div>`;
    const imgBtn = `<i class="fa fa-picture-o" id="imgUpBtn" style="margin-left:10px;cursor:pointer;"></i>`;
    const urlImg = `<div id="boxUrlImg" style="display:flex;width:80%;margin:auto">
        <input type="text" maxlength="200" placeholder="Ingrese el LINK de la imágen" style="background:#e1fcff;border:none;width:100%;border-bottom-left-radius:20px;border-top-left-radius:20px;font-weight:bold;"/>
        <button style="border:none;background:#51ce86;border-bottom-right-radius:20px;border-top-right-radius:20px;font-weight:bold;" id="btnUpImg">Enviar</button>
    </div>`
    $('.textarea-icons-wrapper').append(audioBtn);
    $('.textarea-icons-wrapper').append(imgBtn);
    $('#marqueeContainer').append(urlImg);
    $('#audioBtn').css(falseStyle);
    x.receiveText = (a, b, c) => {
        let z = /^\[audio\]/i;
        let path = b.replace(z, '');
        if (z.test(b)) {
            old.apply(x, [a, `<audio controls src="${serverPath}/${path}"><audio>`, c])
            return;
        }
        old.apply(x, [a, b, c])

    }
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
    $('#imgUpBtn').click(e => {
        if (!stateImg) {
            $('#boxUrlImg').show('slow');
            stateImg = true;
            return null;
        } else {
            $('#boxUrlImg').hide('slow');
            stateImg = false;
            return null;
        }

    });
    $('#btnUpImg').click(e => {
        let val = $('#boxUrlImg input').val();
        if (!val || val.length <= 0) return null;
        let valParsed = val.replace(/https?\:/, '');
        x.emojiArea[0].emojioneArea.setHTML(`<img class='gif' src='${valParsed}'/>`);
        x.sendText();
        $('#boxUrlImg input').val('');
    });
    mediaRecorder.ondataavailable = e => {
        chunks.push(e.data);
    }
    mediaRecorder.onstop = e => {
        let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        chunks = [];
        let form = new FormData();
        form.append('archivo', blob);
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
            error: e => console.log(e)
        })
    }

}
main();