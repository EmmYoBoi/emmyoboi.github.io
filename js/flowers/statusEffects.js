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
            await game.log(`${flower.name} #${flower.flowerId} is badly poisoned! It lost 4 base Style Points!`);
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
        (flower, game) => {
            flower.baseStylePoints = Math.max(
                0,
                flower.baseStylePoints - 2
            );
            await game.log(`${flower.name} #${flower.flowerId} is poisoned! It lost 2 base Style Points!`);
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
            await game.log(`${flower.name} #${flower.flowerId} is stunned; it won't apply its special effect!`);
        },
        1,
        1
    );
}
