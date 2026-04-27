import EventEmitter from 'node:events';

export default class ChannelStatus {
    currentTime = '00:00:00:00';
    eventEmitter = new EventEmitter();
    remainingTime = '00:00:00:00';

    #currentSeconds = 0;
    #frameRate = 0;
    #totalSeconds = 0;

    updateTime(currentSeconds, totalSeconds) {
        this.#currentSeconds = currentSeconds;
        this.#totalSeconds = totalSeconds;

        this.recalculateTime();
    }

    updateFrameRate(numerator, denominator) {
        const frameRate = denominator === 0 ? 0 : numerator / denominator;

        if (frameRate != this.#frameRate) {
            this.#frameRate = frameRate;
            this.recalculateTime();
        }
    }

    recalculateTime() {
        this.currentTime = this.secondsToTimecode(this.#currentSeconds);
        this.remainingTime = this.secondsToTimecode((this.#totalSeconds - this.#currentSeconds));

        this.eventEmitter.emit('update', this);
    }

    secondsToTimecode(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const frame = Math.floor((totalSeconds % 1) * this.#frameRate);

        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}:${this.pad(frame)}`;
    }

    pad(num) {
        return num.toString().padStart(2, '0');
    }
}
