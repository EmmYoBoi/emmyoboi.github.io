let nextFlowerId = 1;

export class Flower {
    constructor(
        name,
        baseStylePoints,
        flashColor = "#ffffff",
        flashFunction = null,
        priority = 1,
        specialFunction = null,
        specialChance = null,
        tags = []
    ) {
        this.name = name;
        this.baseStylePoints = baseStylePoints;
        this.turnPoints = baseStylePoints;
        this.priority = priority;
        this.specialFunction = specialFunction;
        this.baseSpecialChance = specialChance;
        this.specialChance = this.baseSpecialChance;
        this.tags = tags;
        this.flashColor = flashColor;
        this.flashFunction = flashFunction;

        this.flowerId = nextFlowerId++;

        this.statuses = [];
        this.statusCooldowns = [];
    }

    async flash(color=this.flashColor) {
        if (this.flashFunction !== null) {
            await this.flashFunction(this, color);
        }
    }

    resetTurnPoints() {
        this.turnPoints = this.baseStylePoints;
    }

    resetSpecialChance() {
        this.specialChance = this.baseSpecialChance;
    }

    async executeSpecial(game, bouquet, opponentBouquet) {
        if (this.specialFunction === null) return;

        if (Math.random() > this.specialChance) return;

        await this.specialFunction(
            this,
            game,
            bouquet,
            opponentBouquet
        );
    }

    hasTag(tag) {
        return this.tags.includes(tag);
    }

    addTag(tag) {
        if (!this.hasTag(tag)) {
            this.tags.push(tag);
        }
    }

    hasStatus(type) {
        return this.statuses.some(
            status => status.type === type
        );
    }

    hasStatusFrom(type, sourceFlowerId) {
        return this.statuses.some(
            status =>
                status.type === type &&
                status.sourceFlowerId === sourceFlowerId
        );
    }

    hasStatusCooldownFrom(type, sourceFlowerId) {
        return this.statusCooldowns.some(
            cooldown =>
                cooldown.type === type &&
                cooldown.sourceFlowerId === sourceFlowerId &&
                cooldown.turnsRemaining > 0
        );
    }

    hasStatusCooldown(type) {
        return this.statusCooldowns.some(
            cooldown =>
                cooldown.type === type &&
                cooldown.turnsRemaining > 0
        );
    }

    addStatusCooldown(
        type,
        sourceFlowerId,
        turnsRemaining
    ) {
        if (this.hasStatusCooldownFrom(
            type,
            sourceFlowerId
        )) {
            return;
        }

        this.statusCooldowns.push({
            type,
            sourceFlowerId,
            turnsRemaining
        });
    }

    addStatus(status) {
        if (
            this.hasStatusFrom(
                status.type,
                status.sourceFlowerId
            )
        ) {
            return false;
        }

        if (
            this.hasStatusCooldownFrom(
                status.type,
                status.sourceFlowerId
            )
        ) {
            return false;
        }

        this.statuses.push(status);

        return true;
    }

    async processStatuses(game, priorityPhase) {
        // Filter statuses based on priority phase
        const statusesToProcess = this.statuses.filter(status => {
            if (priorityPhase === "pre") {
                return status.priority < 0;
            } else if (priorityPhase === "reset") {
                return status.priority === 0;
            } else if (priorityPhase === "post") {
                return status.priority > 0;
            }
            return false;
        });
        const expiredStatuses = [];

        // Sort statuses by priority (ascending, so lower priorities execute first)
        const sortedStatuses = [...statusesToProcess].sort(
            (a, b) => a.priority - b.priority
        );

        for (const status of sortedStatuses) {
            await status.trigger(this, game);

            if (status.isExpired()) {
                expiredStatuses.push(status);
            }
        }

        for (const status of expiredStatuses) {
            if (status.exhaustionDuration > 0) {
                this.addStatusCooldown(
                    status.type,
                    status.sourceFlowerId,
                    status.exhaustionDuration + 1
                );
            }
        }

        this.statuses = this.statuses.filter(
            status => !status.isExpired()
        );
    }

    processEndOfTurnCooldowns() {
        for (const cooldown of this.statusCooldowns) {
            cooldown.turnsRemaining--;
        }

        this.statusCooldowns =
            this.statusCooldowns.filter(
                cooldown =>
                    cooldown.turnsRemaining > 0
            );
    }
}
