import { Game } from "./game/Game.js";

import { Player } from "./game/Player.js";

import { setupGame } from "./ui/setup.js";

import {
    requestSwitch,
    clearControls
} from "./ui/controls.js";

import { print } from "./ui/logger.js";

import { renderGame } from "./ui/renderer.js";


let game = null;


async function startGame() {

    print(
        "Welcome to Flower Battle."
    );


    /*
        Set up both players and get
        the target style points.
    */

    const gameSetup =
        await setupGame();

    const players =
        gameSetup.players;

    const targetStylePoints =
        gameSetup.targetStylePoints;


    const player1 =
        new Player(
            players[0].name,
            players[0].activeBouquet,
            players[0].reserveBouquet
        );


    const player2 =
        new Player(
            players[1].name,
            players[1].activeBouquet,
            players[1].reserveBouquet
        );


    /*
        Create game with the selected
        target style points.
    */

    game = new Game(
        targetStylePoints,

        message => {
            print(message);
        },

        () => {
            renderGame(game);
        }
    );


    game.addPlayer(player1);
    game.addPlayer(player2);


    /*
        Initial rendering.
    */

    renderGame(game);


    print(
        "Both bouquets are ready."
    );

    print(
        "🌺 BATTLE BEGIN!"
    );


    /*
        Main game loop.
    */

    let winner = null;


    while (winner === null) {

        renderGame(game);


        winner =
            await game.playTurn(
                async players => {

                    /*
                        Each player gets their own
                        graphical switch phase.
                    */

                    for (
                        const player of players
                    ) {

                        await requestSwitch(
                            player,
                            game
                        );


                        renderGame(
                            game
                        );
                    }
                }
            );


        renderGame(game);
    }


    /*
        Game over.
    */

    clearControls();


    const restart =
        document.createElement("button");

    restart.className =
        "action primary";

    restart.textContent =
        "Play Again";


    restart.onclick = () => {
        location.reload();
    };


    document
        .getElementById("controls")
        .appendChild(restart);
}


startGame().catch(error => {

    print(
        `ERROR: ${error.message}`
    );

    console.error(error);
});


export {
    game
};
