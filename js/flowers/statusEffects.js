import { Status } from "./Status.js";

export function ToxicStatus(sourceFlowerId, duration = 3) {
    return new Status(
        "toxic",
        sourceFlowerId,
        duration,
        (flower) => {
            flower.baseStylePoints = Math.max(
                0,
                flower.baseStylePoints - 4
            );
        },
        2,
        -1
    );
}

export function PoisonStatus(sourceFlowerId, duration = 5) {
    return new Status(
        "poison",
        sourceFlowerId,
        duration,
        (flower) => {
            flower.baseStylePoints = Math.max(
                0,
                flower.baseStylePoints - 2
            );
        },
        1,
        -1
    );
}

export function StunStatus(sourceFlowerId, duration = 3) {
    return new Status(
        "stun",
        sourceFlowerId,
        duration,
        (flower, game) => {
            flower.specialChance = 0;
            game.log(`${flower.name} #${flower.flowerId} is stunned; it can't apply its special effect!`);
        },
        1,
        1
    );
}
