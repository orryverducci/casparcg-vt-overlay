let channel, socket;

function onConnect() {
    socket.emit('subscribe', channel);
}

function updateTime(currentTime, remainingTime) {
    document.getElementById('current-time').textContent = currentTime;
    document.getElementById('remaining-time').textContent = remainingTime;
}

function updateName(name) {
    document.getElementById('name').textContent = name;
}

window.addEventListener('DOMContentLoaded',function () {
    channel = document.querySelector('body').dataset.channel;
    socket = io();

    socket.on('connect', onConnect);
    socket.on('time', updateTime);
    socket.on('name', updateName);
});
