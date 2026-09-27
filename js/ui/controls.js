import { print } from "./logger.js";

import {
    renderGame,
    setPlayerView
} from "./renderer.js";


let controlsElement = null;


export function initializeControls() {

    controlsElement =
        document.getElementById(
            "controls"
        );
}


export function clearControls() {

    if (!controlsElement) {
        initializeControls();
    }

    controlsElement.innerHTML = "";
}


function createButton(
    text,
    className = "action"
) {

    const button =
        document.createElement("button");

    button.className =
        className;

    button.textContent =
        text;

    return button;
}


/*
    Handles the switching phase for one player.

    Step 1:
        Player sees their ACTIVE bouquet.

    Step 2:
        Player either chooses No Switch,
        or clicks a flower directly.

    Step 3:
        The UI automatically switches to
        the RESERVE bouquet.

    Step 4:
        Player clicks the reserve flower
        they want to bring in.

    Step 5:
        The two actual Flower objects are exchanged.
*/
export function requestSwitch(
    player,
    game
) {

    return new Promise(resolve => {

        clearControls();


        /*
            Always begin from ACTIVE.
        */

        const playerIndex =
            game.players.indexOf(player);

        setPlayerView(
            playerIndex,
            "active"
        );


        /*
            Instructions
        */

        const title =
            document.createElement("div");

        title.className =
            "control-title";

        title.textContent =
            `${player.name}: choose whether to switch a flower`;


        controlsElement.appendChild(
            title
        );


        /*
            No Switch
        */

        const noSwitchButton =
            createButton(
                "No Switch",
                "action secondary"
            );


        noSwitchButton.onclick = () => {

            player.pendingSwitchLog =
                null;


            setPlayerView(
                playerIndex,
                "active"
            );


            clearControls();

            renderGame(game);

            resolve(false);
        };


        controlsElement.appendChild(
            noSwitchButton
        );


        /*
            Render the ACTIVE bouquet.

            Its flower cards are now clickable.
        */

        renderGame(
            game,
            {
                selectionMode:
                    "activeSwitch",

                selectingPlayer:
                    player,

                onFlowerSelected:
                    activeFlower => {

                        /*
                            Active flower has been selected.
                        */

                        clearControls();


                        const instruction =
                            document.createElement("div");

                        instruction.className =
                            "control-title";

                        instruction.textContent =
                            `Now choose a reserve flower to replace ` +
                            `${activeFlower.name} #${activeFlower.flowerId}`;


                        controlsElement.appendChild(
                            instruction
                        );


                        /*
                            Switch the visible bouquet
                            to RESERVE.
                        */

                        setPlayerView(
                            playerIndex,
                            "reserve"
                        );


                        /*
                            Render the RESERVE bouquet.

                            Only reserve flowers are now clickable.
                        */

                        renderGame(
                            game,
                            {
                                selectionMode:
                                    "reserveSwitch",

                                selectingPlayer:
                                    player,

                                onFlowerSelected:
                                    reserveFlower => {

                                        /*
                                            Actually perform
                                            the exchange.
                                        */

                                        player.switchFlower(
                                            activeFlower,
                                            reserveFlower
                                        );


                                        print(
                                            `🔄 ${player.name} switched ` +
                                            `${activeFlower.name} #${activeFlower.flowerId} ` +
                                            `with ` +
                                            `${reserveFlower.name} #${reserveFlower.flowerId}.`
                                        );


                                        /*
                                            Return to ACTIVE view.
                                        */

                                        setPlayerView(
                                            playerIndex,
                                            "active"
                                        );


                                        clearControls();

                                        renderGame(
                                            game
                                        );


                                        resolve(true);
                                    }
                            }
                        );
                    }
            }
        );
    });
}
