import EventEmitter from 'node:events';

export default class ChannelStatus {
    currentTime = '00:00:00:00';
    eventEmitter = new EventEmitter();
    remainingTime = '00:00:00:00';

    #currentFrame = 0;
    #frameRate = 0;
    #totalFrames = 0;

    updateTime(currentFrame, totalFrames) {
        this.#currentFrame = currentFrame
        this.#totalFrames = totalFrames;

        this.recalculateTime();
    }

    updateFrameRate(numerator, denominator) {
        this.#frameRate = numerator / denominator;

        this.recalculateTime();
    }

    recalculateTime() {
        this.currentTime = this.framesToTimecode(this.#currentFrame);
        this.remainingTime = this.framesToTimecode(this.#totalFrames - this.#currentFrame);

        this.eventEmitter.emit('update', this);
    }

    framesToTimecode(frames) {
        const hours = Math.floor(frames / (3600 * this.#frameRate));
        const minutes = Math.floor((frames % (3600 * this.#frameRate)) / (60 * this.#frameRate));
        const seconds = Math.floor((frames % (60 * this.#frameRate)) / this.#frameRate);
        const frame = frames % this.#frameRate;

        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}:${this.pad(frame)}`;
    }

    pad(num) {
        return num.toString().padStart(2, '0');
    }
}
