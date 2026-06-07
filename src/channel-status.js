import EventEmitter from 'node:events';

export default class ChannelStatus {
    currentTime = '00:00:00:00';
    eventEmitter = new EventEmitter();
    remainingTime = '00:00:00:00';
    name = '';

    #currentSeconds = 0;
    #frameRateDenominator = 0;
    #frameRateNumerator = 0;
    #totalSeconds = 0;
    

    updateTime(currentSeconds, totalSeconds) {
        if (currentSeconds == this.#currentSeconds && totalSeconds == this.#totalSeconds) {
            return;
        }

        this.#currentSeconds = currentSeconds;
        this.#totalSeconds = totalSeconds;

        this.recalculateTime();
    }

    updateFrameRate(numerator, denominator) {
        if (numerator == this.#frameRateNumerator && denominator == this.#frameRateDenominator) {
            return;
        }

        this.#frameRateNumerator = numerator;
        this.#frameRateDenominator = denominator;

        this.recalculateTime();
    }

    updateName(name) {
        this.name = name;
        this.eventEmitter.emit('name-update');
    }

    recalculateTime() {
        this.currentTime = this.secondsToTimecode(this.#currentSeconds);
        this.remainingTime = this.secondsToTimecode((this.#totalSeconds - this.#currentSeconds));

        this.eventEmitter.emit('time-update');
    }

    secondsToTimecode(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const frame = Math.floor((totalSeconds % 1) * (this.#frameRateNumerator / this.#frameRateDenominator));

        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}:${this.pad(frame)}`;
    }

    pad(num) {
        return num.toString().padStart(2, '0');
    }
}
