let channel, socket;

function onConnect() {
    socket.emit('subscribe', channel);
}

window.addEventListener('DOMContentLoaded',function () {
    channel = document.querySelector("body").channel;
    socket = io();

    socket.on('connect', onConnect);
});
