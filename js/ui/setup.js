import {
    Bouquet
} from "../game/Bouquet.js";

import {
    flowerTypes,
    flowerMetadata
} from "../flowers/flowerTypes.js";


const setup =
    document.getElementById(
        "setup"
    );


const setupContent =
    document.getElementById(
        "setupContent"
    );


export async function createPlayer(
    name
) {

    const active =
        await setupBouquet(
            name,
            "Active"
        );


    const reserve =
        await setupBouquet(
            name,
            "Reserve"
        );


    return {

        name,

        activeBouquet:
            active,

        reserveBouquet:
            reserve

    };

}


export async function setupGame() {

    setup.classList.remove(
        "hidden"
    );


    setupContent.innerHTML = `

        <div style="text-align:center">

            <p>
                Each player builds an Active
                and a Reserve bouquet.
            </p>

            <p>
                Each bouquet contains exactly
                6 flowers.
            </p>

            <p>
                The same flower type may be
                selected multiple times.
            </p>

            <button
                class="action primary"
                id="beginSetup"
            >
                Begin Setup
            </button>

        </div>

    `;


    await new Promise(
        resolve => {

            document
                .getElementById(
                    "beginSetup"
                )
                .onclick =
                resolve;

        }
    );


    const player1 =
        await createPlayer(
            "Player 1"
        );


    const player2 =
        await createPlayer(
            "Player 2"
        );


    setup.classList.add(
        "hidden"
    );


    return [
        player1,
        player2
    ];

}


function setupBouquet(
    playerName,
    bouquetType
) {

    return new Promise(
        resolve => {

            const chosen = [];


            setupContent.innerHTML =
                "";


            const heading =
                document.createElement(
                    "h2"
                );


            heading.textContent =
                `${playerName} — ${bouquetType} Bouquet`;


            setupContent.appendChild(
                heading
            );


            const subtitle =
                document.createElement(
                    "div"
                );


            subtitle.className =
                "setup-subtitle";


            subtitle.textContent =
                "Choose exactly 6 flowers.";


            setupContent.appendChild(
                subtitle
            );


            const pool =
                document.createElement(
                    "div"
                );


            pool.id =
                "pool";


            setupContent.appendChild(
                pool
            );


            const selected =
                document.createElement(
                    "div"
                );


            selected.id =
                "selected";


            setupContent.appendChild(
                selected
            );


            const message =
                document.createElement(
                    "div"
                );


            message.id =
                "setupMessage";


            setupContent.appendChild(
                message
            );


            const done =
                document.createElement(
                    "button"
                );


            done.className =
                "action primary";


            done.textContent =
                "Confirm Bouquet";


            done.disabled =
                true;


            setupContent.appendChild(
                done
            );


            // ------------------------------------------------
            // Selection rendering
            // ------------------------------------------------

            function refreshSelection() {

                selected.innerHTML =
                    "";


                const list =
                    document.createElement(
                        "div"
                    );


                list.className =
                    "selection-list";


                chosen.forEach(

                    (
                        flowerIndex,
                        selectionIndex
                    ) => {

                        const choice =
                            document.createElement(
                                "button"
                            );


                        choice.className =
                            "choice";


                        choice.textContent =

                            `${selectionIndex + 1}. ` +

                            flowerMetadata[
                                flowerIndex
                            ].name;


                        choice.title =
                            "Click to remove";


                        choice.onclick = () => {

                            chosen.splice(
                                selectionIndex,
                                1
                            );


                            refreshSelection();

                        };


                        list.appendChild(
                            choice
                        );

                    }

                );


                selected.appendChild(
                    list
                );


                message.textContent =
                    `${chosen.length}/6 selected`;


                done.disabled =
                    chosen.length !== 6;

            }


            // ------------------------------------------------
            // Flower pool
            // ------------------------------------------------

            flowerMetadata.forEach(

                (
                    metadata,
                    index
                ) => {

                    const button =
                        document.createElement(
                            "button"
                        );


                    button.className =
                        "pool-flower";


                    /*
                        Flower color is used by the
                        button and tooltip.
                    */

                    button.style.setProperty(
                        "--flower-color",
                        metadata.color
                    );


                    /*
                        Custom tooltip
                    */

                    const tooltip =
                        document.getElementById(
                            "flower-tooltip"
                        );


                    button.addEventListener(
                        "mouseenter",
                        event => {

                            tooltip
                                .querySelector(
                                    ".tooltip-name"
                                )
                                .textContent =
                                metadata.name;


                            tooltip
                                .querySelector(
                                    ".tooltip-bsp"
                                )
                                .textContent =
                                `${metadata.baseStylePoints} BSP`;


                            tooltip
                                .querySelector(
                                    ".tooltip-description"
                                )
                                .textContent =
                                metadata.description;


                            tooltip.style.setProperty(
                                "--flower-color",
                                metadata.color
                            );


                            tooltip.classList.add(
                                "visible"
                            );


                            updateTooltipPosition(
                                event
                            );

                        }
                    );


                    button.addEventListener(
                        "mousemove",
                        event => {

                            updateTooltipPosition(
                                event
                            );

                        }
                    );


                    button.addEventListener(
                        "mouseleave",
                        () => {

                            tooltip.classList.remove(
                                "visible"
                            );

                        }
                    );


                    /*
                        Sprite with emoji fallback.

                        The button contains ONLY these.
                    */

                    const image =
                        document.createElement(
                            "img"
                        );


                    image.className =
                        "pool-flower-sprite";


                    image.src =
                        metadata.sprite;


                    image.alt =
                        metadata.name;


                    const emoji =
                        document.createElement(
                            "span"
                        );


                    emoji.className =
                        "pool-flower-emoji";


                    emoji.textContent =
                        metadata.emoji;


                    emoji.style.display =
                        "none";


                    image.onerror =
                        () => {

                            image.style.display =
                                "none";


                            emoji.style.display =
                                "block";

                        };


                    button.appendChild(
                        image
                    );


                    button.appendChild(
                        emoji
                    );


                    /*
                        Selection
                    */

                    button.onclick = () => {

                        if (
                            chosen.length >= 6
                        ) {

                            return;

                        }


                        chosen.push(
                            index
                        );


                        refreshSelection();

                    };


                    pool.appendChild(
                        button
                    );

                }

            );


            // ------------------------------------------------
            // Confirmation
            // ------------------------------------------------

            done.onclick = () => {

                const flowers =
                    chosen.map(
                        index =>
                            flowerTypes[
                                index
                            ]()
                    );


                resolve(

                    new Bouquet(

                        `${playerName} ${bouquetType}`,

                        flowers

                    )

                );

            };


            refreshSelection();

        }
    );

}


function updateTooltipPosition(
    event
) {

    const tooltip =
        document.getElementById(
            "flower-tooltip"
        );


    const offset =
        15;


    let x =
        event.clientX +
        offset;


    let y =
        event.clientY +
        offset;


    const rect =
        tooltip.getBoundingClientRect();


    if (
        x + rect.width >
        window.innerWidth
    ) {

        x =
            event.clientX -
            rect.width -
            offset;

    }


    if (
        y + rect.height >
        window.innerHeight
    ) {

        y =
            event.clientY -
            rect.height -
            offset;

    }


    tooltip.style.left =
        `${x}px`;


    tooltip.style.top =
        `${y}px`;

}