async function main() {

    const x = chatHTML5;
    const old = x.receiveText;
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const mediaRecorder = new MediaRecorder(stream);
    let state = false;
    let chunks = [];
    let serverPath = `https://andyaudio.herokuapp.com`;
    let falseStyle = { width: '40px', heigth: '40px', borderRadius: '9999px', background: '#51ce86', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' };
    const audioBtn = `<div id="audioBtn">
        <i class="fa fa-microphone" />
        <p id="audioTxt"></p>
    </div>`;
    $('.textarea-icons-wrapper').append(audioBtn);
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
    mediaRecorder.ondataavailable = e => {
        chunks.push(e.data);
    }
    mediaRecorder.onstop = e => {
        let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        chunks = [];
        let form = new FormData();
        form.append('archivo', blob);
        $.ajax({
            url: serverPath,
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