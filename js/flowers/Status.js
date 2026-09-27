export class Status {
    constructor(
        type,
        sourceFlowerId,
        duration,
        effectFunction,
        exhaustionDuration = 0
    ) {
        this.type = type;
        this.sourceFlowerId = sourceFlowerId;
        this.duration = duration;
        this.effectFunction = effectFunction;
        this.exhaustionDuration = exhaustionDuration;
    }

    async trigger(flower, game) {
        await this.effectFunction(flower, game);
        this.duration--;
    }

    isExpired() {
        return this.duration <= 0;
    }
}