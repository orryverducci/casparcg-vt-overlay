let channel, socket;

function onConnect() {
    socket.emit('subscribe', channel);
}

function updateCurrentTime(currentTime) {
    document.getElementById('current-time').textContent = currentTime;
}

function updateRemainingTime(remainingTime) {
    document.getElementById('remaining-time').textContent = remainingTime;
}

function updateName(name) {
    document.getElementById('name').textContent = name;
}

window.addEventListener('DOMContentLoaded',function () {
    channel = document.querySelector('body').dataset.channel;
    socket = io();

    socket.on('connect', onConnect);
    socket.on('current-time', updateCurrentTime);
    socket.on('remaining-time', updateRemainingTime);
    socket.on('name', updateName);
});
