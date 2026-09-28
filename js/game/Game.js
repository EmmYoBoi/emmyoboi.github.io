export class Game {

    constructor(
        targetStylePoints = 1000,
        logFunction = null,
        updateFunction = null
    ) {
        this.targetStylePoints =
            targetStylePoints;

        this.turn =
            0;

        this.weather =
            0;

        this.time =
            "day";

        this.timeRemaining =
            6;

        this.players =
            [];

        this.logFunction =
            logFunction;

        this.updateFunction =
            updateFunction;

        this.eventQueue =
            Promise.resolve();

        this.eventDelay =
            1000;
    }


    /*
        Every log message is added to a sequential queue.

        This means:

        log A
            ↓
        1 second
            ↓
        log B
            ↓
        1 second
            ↓
        log C

        The returned Promise resolves when that particular
        event has finished displaying.
    */

    updateDisplay() {

        if (
            this.updateFunction !== null
        ) {

            this.updateFunction();
        }
    }


    log(message) {

        if (
            this.logFunction !== null
        ) {

            this.logFunction(message);
        }

        this.eventQueue =
            this.eventQueue.then(
                () =>
                    this.sleep(
                        this.eventDelay
                    )
            );

        return this.eventQueue;
    }


    sleep(milliseconds) {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    milliseconds
                )
        );
    }


    /*
        Wait until every currently queued event
        has finished displaying.
    */

    async waitForEvents() {

        await this.eventQueue;
    }


    addPlayer(player) {

        this.players.push(
            player
        );
    }


    getActiveBouquets() {

        return this.players.map(
            player =>
                player.activeBouquet
        );
    }


    /*
        Returns groups containing:

        {
            flower,
            bouquet,
            player
        }

        These groups are useful because effects need
        to know both the flower and its context.
    */

    getAllActiveFlowerGroups() {

        const groups = [];


        for (
            const player of
            this.players
        ) {

            for (
                const flower of
                player.activeBouquet.flowers
            ) {

                groups.push({

                    flower,

                    bouquet:
                        player.activeBouquet,

                    player

                });
            }
        }


        return groups;
    }


    getOpponentPlayer(player) {

        return this.players.find(
            otherPlayer =>
                otherPlayer !== player
        ) ?? null;
    }


    getOpponentBouquet(player) {

        const opponent =
            this.getOpponentPlayer(
                player
            );


        if (
            opponent === null
        ) {

            return null;
        }


        return opponent.activeBouquet;
    }


    updateWeather() {

        if (
            this.time === "day"
        ) {

            this.weather += 1;

        } else {

            this.weather -= 1;
        }
    }


    getWeather() {

        if (
            this.weather <= -15
        ) {

            return "blizzard";
        }


        if (
            this.weather < -5
        ) {

            return "rainy";
        }


        if (
            this.weather <= 5
        ) {

            return "clear";
        }


        if (
            this.weather < 15
        ) {

            return "warm";
        }


        return "heatwave";
    }


    advanceTime() {

        this.timeRemaining--;


        if (
            this.timeRemaining > 0
        ) {

            return;
        }


        this.time =
            this.time === "day"
                ? "night"
                : "day";


        this.timeRemaining =
            5;


        this.resetNightExtenders();
    }


    resetNightExtenders() {

        if (
            this.time !== "night"
        ) {

            return;
        }


        for (
            const player of
            this.players
        ) {

            for (
                const bouquet of [

                    player.activeBouquet,

                    player.reserveBouquet

                ]
            ) {

                for (
                    const flower of
                    bouquet.flowers
                ) {

                    if (
                        flower.name ===
                        "NightExtender"
                    ) {

                        flower.usedThisNight =
                            false;
                    }
                }
            }
        }
    }


    resetTurnPoints() {

        for (
            const player of
            this.players
        ) {

            player.activeBouquet
                .resetTurnPoints();
        }
    }

    resetSpecialChances() {

        for (
            const player of
            this.players
        ) {

            player.activeBouquet
                .resetSpecialChances();
        }
    }


    getSortedEffects() {

        const effects =
            this.getAllActiveFlowerGroups();


        effects.sort(
            (a, b) =>
                a.flower.priority -
                b.flower.priority
        );


        return effects;
    }


    async executeEffects(
        effects,
        phase
    ) {

        for (
            const effect of
            effects
        ) {

            const priority =
                effect.flower.priority;


            if (
                phase === "pre" &&
                priority >= 0
            ) {

                break;
            }


            if (
                phase === "post" &&
                priority <= 0
            ) {

                continue;
            }


            const opponentBouquet =
                this.getOpponentBouquet(
                    effect.player
                );


            /*
                executeSpecial() may be async.

                This is important because a flower such
                as Thornbush can pause between individual
                targets.
            */

            await effect.flower.executeSpecial(

                this,

                effect.bouquet,

                opponentBouquet

            );


            this.updateDisplay();


            /*
                Make sure any events generated by this
                effect have completely finished before
                the next flower acts.
            */

            await this.waitForEvents();
        }
    }


    async processStatuses() {

        for (
            const group of
            this.getAllActiveFlowerGroups()
        ) {

            await group.flower.processStatuses(
                this
            );
        }


        await this.waitForEvents();
    }


    async scoreFlowers() {

        for (
            const player of
            this.players
        ) {

            await player.activeBouquet
                .collectFlowerPoints();

            player.activeBouquet
                .collectStylePoints();
        }

        this.updateDisplay();

        await this.waitForEvents();

        this.log("========== POINTS SCORED! ==========");
}


    async processEndOfTurnCooldowns() {

        for (
            const group of
            this.getAllActiveFlowerGroups()
        ) {

            group.flower
                .processEndOfTurnCooldowns();
        }


        await this.waitForEvents();
    }


    async beginTurn() {

        for (
            const player of
            this.players
        ) {

            player.logPendingSwitch(
                this
            );
        }

        await this.waitForEvents();


        this.updateWeather();

        this.advanceTime();

        this.resetSpecialChances();

        await this.processStatuses();

        this.resetTurnPoints();

        this.updateDisplay();
    }


    async playTurn(
        switchFunction
    ) {

        this.turn++;


        this.log(
            `========== TURN ${this.turn} ==========`
        );


        await this.beginTurn();


        const effects =
            this.getSortedEffects();


        /*
            Pre-scoring effects.
        */

        await this.executeEffects(
            effects,
            "pre"
        );


        /*
            Scoring.
        */

        await this.scoreFlowers();


        /*
            Post-scoring effects.
        */

        await this.executeEffects(
            effects,
            "post"
        );


        /*
            End-of-turn cooldowns.
        */

        await this.processEndOfTurnCooldowns();


        const winner =
            this.checkVictory();


        if (
            winner !== null
        ) {

            await this.waitForEvents();

            return winner;
        }


        /*
            Make absolutely sure that every event
            generated during the turn has finished
            before switching begins.
        */

        await this.waitForEvents();


        if (
            switchFunction !== null
        ) {

            await switchFunction(
                this.players
            );
        }


        return null;
    }


    checkVictory() {

        for (
            const player of
            this.players
        ) {

            if (
                player.activeBouquet.stylePoints >=
                this.targetStylePoints
            ) {

                this.log(
                    `🏆 ${player.name} WINS!`
                );


                return player;
            }
        }


        return null;
    }

}
