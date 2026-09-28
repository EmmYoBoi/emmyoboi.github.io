export class StatusCooldown {
    constructor(type, sourceFlowerId, turnsRemaining) {
        this.type = type;
        this.sourceFlowerId = sourceFlowerId;
        this.turnsRemaining = turnsRemaining;
    }

    isActive() {
        return this.turnsRemaining > 0;
    }

    decrementTurn() {
        this.turnsRemaining--;
    }
}

export class StatusManager {
    constructor(statusesArray, cooldownsArray) {
        // Wrap existing arrays instead of creating new ones
        // This keeps the API backward compatible
        this.statuses = statusesArray;
        this.cooldowns = cooldownsArray;
    }

    // Unified query: check if a status exists (optionally by source)
    hasStatus(type, sourceFlowerId = null) {
        return this.statuses.some(status =>
            status.type === type &&
            (sourceFlowerId === null || status.sourceFlowerId === sourceFlowerId)
        );
    }

    // Unified query: check if a cooldown is active (optionally by source)
    hasCooldown(type, sourceFlowerId = null) {
        return this.cooldowns.some(cooldown =>
            cooldown.type === type &&
            cooldown.isActive() &&
            (sourceFlowerId === null || cooldown.sourceFlowerId === sourceFlowerId)
        );
    }

    // Add a status (returns success boolean)
    addStatus(status) {
        // Can't add if already active or on cooldown
        if (this.hasStatus(status.type, status.sourceFlowerId)) {
            return false;
        }

        if (this.hasCooldown(status.type, status.sourceFlowerId)) {
            return false;
        }

        this.statuses.push(status);
        return true;
    }

    // Mark a status as expired and start cooldown if needed
    expireStatus(status) {
        // Remove from active statuses
        const index = this.statuses.indexOf(status);
        if (index > -1) {
            this.statuses.splice(index, 1);
        }

        // Add cooldown if this status has exhaustion duration
        if (status.exhaustionDuration > 0) {
            this.cooldowns.push(
                new StatusCooldown(
                    status.type,
                    status.sourceFlowerId,
                    status.exhaustionDuration + 1
                )
            );
        }
    }

    // Process all active statuses and handle expiration
    async processStatuses(flower, game, priorityFilter = null) {
        // Filter statuses if a priority filter is provided
        let statusesToProcess = this.statuses;
        if (priorityFilter !== null) {
            statusesToProcess = this.statuses.filter(priorityFilter);
        }

        // Sort by priority
        const sorted = [...statusesToProcess].sort((a, b) => a.priority - b.priority);

        // Trigger each status
        for (const status of sorted) {
            await status.trigger(flower, game);
        }

        // Handle expiration
        const expired = this.statuses.filter(s => s.isExpired());
        expired.forEach(s => this.expireStatus(s));
    }

    // Decrement all active cooldowns and remove expired ones
    decrementCooldowns() {
        for (const cooldown of this.cooldowns) {
            cooldown.decrementTurn();
        }

        // Remove expired cooldowns
        this.cooldowns = this.cooldowns.filter(cooldown => cooldown.isActive());
    }

    // Clear all statuses and cooldowns
    clear() {
        this.statuses.length = 0;
        this.cooldowns.length = 0;
    }
}
