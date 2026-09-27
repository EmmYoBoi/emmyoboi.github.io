export class Bouquet {

    constructor(
        name,
        flowers = []
    ) {

        this.name =
            name;

        this.flowers =
            flowers;

        this.stylePoints =
            0;

        this.turnPoints =
            0;
    }


    addFlower(flower) {

        this.flowers.push(
            flower
        );
    }


    removeFlower(flower) {

        const index =
            this.flowers.indexOf(
                flower
            );


        if (
            index === -1
        ) {

            return false;
        }


        this.flowers.splice(
            index,
            1
        );


        return true;
    }


    resetTurnPoints() {

        this.turnPoints =
            0;


        for (
            const flower of
            this.flowers
        ) {

            flower.resetTurnPoints();
        }
    }

    resetSpecialChances() {
        for (
            const flower of
            this.flowers
        ) {

            flower.resetSpecialChance();
        }
    }

    getFlowersWithTag(tag) {

        return this.flowers.filter(
            flower =>
                flower.hasTag(tag)
        );
    }


    async collectFlowerPoints() {
        for (const flower of this.flowers) {
            await flower.flash('rgb(210, 143, 0)');
            this.turnPoints += flower.turnPoints;
        }
    }


    collectStylePoints() {

        this.stylePoints +=
            this.turnPoints;
    }

    randomFlower() {
        let randomIndex = Math.floor(Math.random()*(this.flowers.length)-0.001);
        return this.flowers[randomIndex];
    }
}