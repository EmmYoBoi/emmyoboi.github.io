import { Flower } from "./Flower.js";

import {
    ToxicStatus,
    PoisonStatus,
    StunStatus
} from "./statusEffects.js";

import {
    flashFlower
} from "../ui/renderer.js";


function smoother(x) {

    return (
        1 -
        5 / (x + 5)
    );

}


// ============================================================
// SETUP METADATA
// ============================================================

export const flowerMetadata = [

    {
        name: "Rose",
        baseStylePoints: 30,
        color: "#F7282E",
        sprite: "../../assets/flowers/rose.png",
        emoji: "🌹",
        description:
            "A simple flower worth 30 Style Points per turn."
    },

    {
        name: "Lily",
        baseStylePoints: 10,
        color: "rgb(255, 0, 153)",
        sprite: "../../assets/flowers/lily.png",
        emoji: "🌸",
        description:
            "Gains 5 permanent base Style Points each turn."
    },

    {
        name: "Nightflower",
        baseStylePoints: 20,
        color: "#28288A",
        sprite: "../../assets/flowers/nightflower.png",
        emoji: "🌙",
        description:
            "At night, quadruples its turn points."
    },

    {
        name: "NightExtender",
        baseStylePoints: 10,
        color: "#6F33C1",
        sprite: "../../assets/flowers/nightextender.png",
        emoji: "⏳",
        description:
            "At night, once per night, extends the night by 3 turns."
    },

    {
        name: "Thornbush",
        baseStylePoints: 15,
        color: "#216024",
        sprite: "../../assets/flowers/thornbush.png",
        emoji: "🌿",
        description:
            "Reduces every opponent flower's turn points by 4. Cannot affect control-immune flowers."
    },

    {
        name: "Coldflower",
        baseStylePoints: 15,
        color: "#88CBF6",
        sprite: "../../assets/flowers/coldflower.png",
        emoji: "❄️",
        description:
            "Gains bonus turn points in rainy or colder weather. The colder it gets, the larger the bonus."
    },

    {
        name: "Coldsetter",
        baseStylePoints: 5,
        color: "#66C5FA",
        sprite: "../../assets/flowers/coldsetter.png",
        emoji: "🥶",
        description:
            "Decreases the weather pointer by 3."
    },

    {
        name: "Warmflower",
        baseStylePoints: 15,
        color: "#F9851A",
        sprite: "../../assets/flowers/warmflower.png",
        emoji: "☀️",
        description:
            "Gains bonus turn points in warm or hotter weather. The hotter it gets, the larger the bonus."
    },

    {
        name: "Warmsetter",
        baseStylePoints: 5,
        color: "#FC3714",
        sprite: "../../assets/flowers/warmsetter.png",
        emoji: "🔥",
        description:
            "Increases the weather pointer by 3."
    },

    {
        name: "Leechflower",
        baseStylePoints: 15,
        color: "#C53698",
        sprite: "../../assets/flowers/leechflower.png",
        emoji: "🩸",
        description:
            "Steals 10% of each opponent flower's turn points, gaining half the amount stolen. Cannot affect control-immune flowers."
    },

    {
        name: "PoisonIvy",
        baseStylePoints: 15,
        color: "#74249D",
        sprite: "../../assets/flowers/poisonivy.png",
        emoji: "☠️",
        description:
            "Poisons opponent flowers that make contact with the bouquet badly, reducing their base sp by every turn for 3 turns. Toxic Poison has a 2-turn exhaustion period per source."
    },

    {
        name: "Monkshood",
        baseStylePoints: 15,
        color: "#523EBE",
        sprite: "../../assets/flowers/monkshood.png",
        emoji: "🪻",
        description:
            "Has a 50% chance to poison a random opponent flower, reducing its base sp every turn for 5 turns. Poison has a 1-turn exhaustion period per source."
    },

    {
        name: "Stunflower",
        baseStylePoints: 15,
        color: "#ffc82f",
        sprite: "../../assets/flowers/stunflower.png",
        emoji: "",
        description:
            "Has a 30% chance to stun a random opponent flower, stopping it from executing its special effect. Stun has a 1-turn exhaustion period, and doesnt stack."
    }
];


// ============================================================
// ROSE
// ============================================================

export function Rose() {

    return new Flower(

        flowerMetadata[0].name,
        flowerMetadata[0].baseStylePoints,
        flowerMetadata[0].color,

        flashFlower

    );

}


// ============================================================
// LILY
// ============================================================

export function Lily() {

    return new Flower(

        flowerMetadata[1].name,
        flowerMetadata[1].baseStylePoints,
        flowerMetadata[1].color,

        flashFlower,

        1,

        async (
            flower,
            game
        ) => {

            flower.baseStylePoints +=
                5;


            await flower.flash();

            await game.log(
                `${flower.name} grows stronger!`
            );

        },

        1
    );

}


// ============================================================
// NIGHTFLOWER
// ============================================================

export function Nightflower() {

    return new Flower(

        flowerMetadata[2].name,
        flowerMetadata[2].baseStylePoints,
        flowerMetadata[2].color,

        flashFlower,

        -4,

        async (
            flower,
            game
        ) => {

            if (
                game.time !== "night"
            ) {

                return;

            }


            flower.turnPoints *=
                4;


            await flower.flash();

            await game.log(
                `${flower.name} blooms in the night! ` +
                `Turn Points quadrupled to ` +
                `${flower.turnPoints}.`
            );

        },
        
        1
    );

}


// ============================================================
// NIGHT EXTENDER
// ============================================================

export function NightExtender() {

    const flower =
        new Flower(

            flowerMetadata[3].name,
            flowerMetadata[3].baseStylePoints,
            flowerMetadata[3].color,

            flashFlower,

            -5,

            async (
                flower,
                game
            ) => {

                if (
                    game.time !== "night" ||
                    flower.usedThisNight
                ) {

                    return;

                }


                game.timeRemaining +=
                    3;


                flower.usedThisNight =
                    true;


                await flower.flash();

                await game.log(
                    `${flower.name} extends the night! ` +
                    `Night duration increased to ` +
                    `${game.timeRemaining} turns remaining.`
                );

            },

            1
        );


    flower.usedThisNight =
        false;


    return flower;

}


// ============================================================
// THORNBUSH
// ============================================================

export function Thornbush() {

    const flower =
        new Flower(

            flowerMetadata[4].name,
            flowerMetadata[4].baseStylePoints,
            flowerMetadata[4].color,

            flashFlower,

            -2,

            async (
                flower,
                game,
                bouquet,
                opponentBouquet
            ) => {

                if (
                    opponentBouquet === null
                ) {

                    return;

                }


                for (
                    const opponentFlower of
                    opponentBouquet.flowers
                ) {

                    if (
                        opponentFlower.hasTag(
                            "controlImmune"
                        )
                    ) {

                        await flower.flash();

                        await opponentFlower.flash(
                            "rgb(90, 90, 90)"
                        );

                        await game.log(
                            `${flower.name} cannot affect ` +
                            `${opponentFlower.name}!`
                        );


                        continue;

                    }


                    opponentFlower.turnPoints =
                        Math.max(

                            0,

                            opponentFlower.turnPoints -
                            4

                        );


                    await flower.flash();

                    await opponentFlower.flash(
                        "rgb(120, 0, 0)"
                    );

                    await game.log(
                        `${opponentFlower.name} is hit by ` +
                        `${flower.name}! Turn Points reduced to ` +
                        `${opponentFlower.turnPoints}.`
                    );

                }

            },
            1,
            ["contact"]
        );


    return flower;

}


// ============================================================
// COLDFLOWER
// ============================================================

export function Coldflower() {

    return new Flower(

        flowerMetadata[5].name,
        flowerMetadata[5].baseStylePoints,
        flowerMetadata[5].color,

        flashFlower,

        -4,

        async (
            flower,
            game
        ) => {

            if (
                game.weather >= -5
            ) {

                return;

            }


            const bonus =
                Math.round(

                    50 *
                    smoother(
                        -game.weather - 5
                    )

                );


            flower.turnPoints +=
                bonus;


            await flower.flash();

            await game.log(
                `${flower.name} thrives in the cold! ` +
                `Turn Points increased to ` +
                `${flower.turnPoints}.`
            );

        },
        1
    );

}


// ============================================================
// COLDSETTER
// ============================================================

export function Coldsetter() {

    return new Flower(

        flowerMetadata[6].name,
        flowerMetadata[6].baseStylePoints,
        flowerMetadata[6].color,

        flashFlower,

        -5,

        async (
            flower,
            game
        ) => {

            game.weather -=
                3;


            await flower.flash();

            await game.log(
                `${flower.name} changes the weather! ` +
                `Weather pointer decreased to ` +
                `${game.weather}.`
            );

        },
        1
    );

}


// ============================================================
// WARMFLOWER
// ============================================================

export function Warmflower() {

    return new Flower(

        flowerMetadata[7].name,
        flowerMetadata[7].baseStylePoints,
        flowerMetadata[7].color,

        flashFlower,

        -4,

        async (
            flower,
            game
        ) => {

            if (
                game.weather <= 5
            ) {

                return;

            }


            const bonus =
                Math.round(

                    50 *
                    smoother(
                        game.weather - 5
                    )

                );


            flower.turnPoints +=
                bonus;


            await flower.flash();

            await game.log(
                `${flower.name} thrives in the heat! ` +
                `Turn Points increased to ` +
                `${flower.turnPoints}.`
            );

        },
        1
    );

}


// ============================================================
// WARMSETTER
// ============================================================

export function Warmsetter() {

    return new Flower(

        flowerMetadata[8].name,
        flowerMetadata[8].baseStylePoints,
        flowerMetadata[8].color,

        flashFlower,

        -5,

        async (
            flower,
            game
        ) => {

            game.weather +=
                3;


            await flower.flash();

            await game.log(
                `${flower.name} changes the weather! ` +
                `Weather pointer increased to ` +
                `${game.weather}.`
            );

        },
        1
    );

}


// ============================================================
// LEECHFLOWER
// ============================================================

export function Leechflower() {

    const flower =
        new Flower(

            flowerMetadata[9].name,
            flowerMetadata[9].baseStylePoints,
            flowerMetadata[9].color,

            flashFlower,

            -3,

            async (
                flower,
                game,
                bouquet,
                opponentBouquet
            ) => {

                if (
                    opponentBouquet === null
                ) {

                    return;

                }


                for (
                    const opponentFlower of
                    opponentBouquet.flowers
                ) {

                    if (
                        opponentFlower.hasTag(
                            "controlImmune"
                        )
                    ) {

                        await flower.flash();

                        await opponentFlower.flash(
                            "rgb(90, 90, 90)"
                        );

                        await game.log(
                            `${flower.name} cannot leech ` +
                            `${opponentFlower.name}!`
                        );


                        continue;

                    }


                    const pointsLeeched =
                        Math.ceil(

                            opponentFlower.turnPoints *
                            0.1

                        );


                    opponentFlower.turnPoints =
                        Math.max(

                            0,

                            opponentFlower.turnPoints -
                            pointsLeeched

                        );


                    const pointsWon =
                        Math.floor(
                            pointsLeeched / 2
                        );


                    flower.turnPoints +=
                        pointsWon;


                    await flower.flash();

                    await opponentFlower.flash(
                        "rgb(120, 0, 0)"
                    );

                    await game.log(
                        `${flower.name} leeches from ` +
                        `${opponentFlower.name}! ` +
                        `${flower.name} gained ${pointsWon}; ` +
                        `${opponentFlower.name} lost ` +
                        `${pointsLeeched}.`
                    );

                }

            },
            1,
            ["contact"]
        );


    return flower;

}


// ============================================================
// POISON IVY
// ============================================================

export function PoisonIvy() {

    return new Flower(

        flowerMetadata[10].name,
        flowerMetadata[10].baseStylePoints,
        flowerMetadata[10].color,

        flashFlower,

        -1,

        async (
            flower,
            game,
            bouquet,
            opponentBouquet
        ) => {

            const contactFlowers =
                opponentBouquet.getFlowersWithTag(
                    "contact"
                );


            for (
                const opponentFlower of
                contactFlowers
            ) {

                if (
                    opponentFlower.hasStatusFrom(
                        "toxic",
                        flower.flowerId
                    )
                ) {

                    await game.log(
                        `${opponentFlower.name} #${opponentFlower.flowerId} ` +
                        `is already poisoned by ${flower.name} #${flower.flowerId}.`
                    );


                    continue;

                }


                if (
                    opponentFlower.hasStatusCooldownFrom(
                        "toxic",
                        flower.flowerId
                    )
                ) {

                    await game.log(
                        `${flower.name} #${flower.flowerId} cannot poison ` +
                        `${opponentFlower.name} #${opponentFlower.flowerId} yet.`
                    );


                    continue;

                }


                const applied =
                    opponentFlower.addStatus(
                        ToxicStatus(
                            flower.flowerId
                        )
                    );


                if (!applied) {

                    continue;

                }


                await flower.flash();

                await opponentFlower.flash(
                    "rgb(120, 0, 0)"
                );


                await game.log(
                    `${flower.name} #${flower.flowerId} poisoned ` +
                    `${opponentFlower.name} #${opponentFlower.flowerId} ` +
                    `for ${ToxicStatus().duration} turns.`
                );

            }

        },
        1,
        ["controlImmune"]

    );

}


export function Monkshood() {

    return new Flower(

        flowerMetadata[11].name,
        flowerMetadata[11].baseStylePoints,
        flowerMetadata[11].color,

        flashFlower,

        1,

        async (
            flower,
            game,
            bouquet,
            opponentBouquet
        ) => {
            const opponentFlower =
                opponentBouquet.randomFlower();


            await game.log(
                `${flower.name} #${flower.flowerId} ` +
                `is trying to poison ` +
                `${opponentFlower.name} #${opponentFlower.flowerId}!`
            );


            if (
                opponentFlower.hasStatusFrom(
                    "poison",
                    flower.flowerId
                )
            ) {

                await game.log(
                    `${opponentFlower.name} #${opponentFlower.flowerId} ` +
                    `is already poisoned by ` +
                    `${flower.name} #${flower.flowerId}.`
                );


                return;

            }


            if (
                opponentFlower.hasStatusCooldownFrom(
                    "poison",
                    flower.flowerId
                )
            ) {

                await game.log(
                    `${flower.name} #${flower.flowerId} cannot poison ` +
                    `${opponentFlower.name} #${opponentFlower.flowerId} yet.`
                );


                return;

            }


            const applied =
                opponentFlower.addStatus(
                    PoisonStatus(
                        flower.flowerId
                    )
                );


            if (!applied) {

                return;

            }


            await flower.flash();

            await opponentFlower.flash(
                "rgb(120, 0, 0)"
            );


            await game.log(
                `${flower.name} #${flower.flowerId} poisoned ` +
                `${opponentFlower.name} #${opponentFlower.flowerId} ` +
                `for ${PoisonStatus().duration} turns.`
            );

        },
        0.5
    );

}

export function Stunflower() {

    return new Flower(

        flowerMetadata[12].name,
        flowerMetadata[12].baseStylePoints,
        flowerMetadata[12].color,

        flashFlower,

        2,

        async (
            flower,
            game,
            bouquet,
            opponentBouquet
        ) => {
            const opponentFlower =
                opponentBouquet.randomFlower();


            await game.log(
                `${flower.name} #${flower.flowerId} ` +
                `is trying to stun ` +
                `${opponentFlower.name} #${opponentFlower.flowerId}!`
            );


            if (
                opponentFlower.hasStatus(
                    "stun"
                )
            ) {

                await game.log(
                    `${opponentFlower.name} #${opponentFlower.flowerId} ` +
                    `is already stunned!`
                );


                return;

            }


            if (
                opponentFlower.hasStatusCooldown(
                    "stun"
                )
            ) {

                await game.log(
                    `${flower.name} #${flower.flowerId} cannot stun ` +
                    `${opponentFlower.name} #${opponentFlower.flowerId} yet.`
                );


                return;

            }


            const applied =
                opponentFlower.addStatus(
                    StunStatus(
                        flower.flowerId
                    )
                );


            if (!applied) {

                return;

            }


            await flower.flash();

            await opponentFlower.flash(
                "rgb(226, 196, 46)"
            );


            await game.log(
                `${flower.name} #${flower.flowerId} stunned ` +
                `${opponentFlower.name} #${opponentFlower.flowerId} ` +
                `for ${StunStatus().duration} turns.`
            );

        },
        0.3
    );

}


// ============================================================
// FLOWER POOL
// ============================================================

export const flowerTypes = [

    Rose,

    Lily,

    Nightflower,

    NightExtender,

    Thornbush,

    Coldflower,

    Coldsetter,

    Warmflower,

    Warmsetter,

    Leechflower,

    PoisonIvy,

    Monkshood,

    Stunflower

];