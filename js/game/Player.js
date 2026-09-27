export class Player {

    constructor(
        name,
        activeBouquet,
        reserveBouquet
    ) {

        this.name =
            name;

        this.activeBouquet =
            activeBouquet;

        this.reserveBouquet =
            reserveBouquet;

        this.pendingSwitchLog =
            null;
    }


    switchFlower(
        activeFlower,
        reserveFlower
    ) {

        if (
            !this.activeBouquet.flowers.includes(
                activeFlower
            )
        ) {

            return false;
        }


        if (
            !this.reserveBouquet.flowers.includes(
                reserveFlower
            )
        ) {

            return false;
        }


        const activeIndex =
            this.activeBouquet.flowers.indexOf(
                activeFlower
            );


        const reserveIndex =
            this.reserveBouquet.flowers.indexOf(
                reserveFlower
            );


        this.activeBouquet.flowers[
            activeIndex
        ] =
            reserveFlower;


        this.reserveBouquet.flowers[
            reserveIndex
        ] =
            activeFlower;


        this.pendingSwitchLog = {

            activeFlowerName:
                activeFlower.name,

            activeFlowerId:
                activeFlower.flowerId,

            reserveFlowerName:
                reserveFlower.name,

            reserveFlowerId:
                reserveFlower.flowerId

        };


        return true;
    }


    logPendingSwitch(game) {

        if (
            this.pendingSwitchLog === null
        ) {

            return;
        }


        const log =
            this.pendingSwitchLog;


        game.log(
            `🔄 ${this.name} switched ` +
            `${log.activeFlowerName} #${log.activeFlowerId} ` +
            `with ` +
            `${log.reserveFlowerName} #${log.reserveFlowerId}.`
        );


        this.pendingSwitchLog =
            null;
    }

}