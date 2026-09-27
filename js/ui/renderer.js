import { flowerMetadata } from "../flowers/flowerTypes.js";


let viewingBouquet = new Map();


/*
    Weather display information.

    The actual game weather is still controlled
    entirely by Game.getWeather() and Game.weather.
*/

function getWeatherDisplay(weather) {

    const displays = {

        blizzard: {
            name: "Blizzard",
            icon: "🌨️"
        },

        rainy: {
            name: "Rainy",
            icon: "🌧️"
        },

        clear: {
            name: "Clear",
            icon: "🌤️"
        },

        warm: {
            name: "warm",
            icon: "☀️"
        },

        heatwave: {
            name: "Heatwave",
            icon: "🔥"
        }

    };


    return (
        displays[weather]
        ?? {
            name: weather,
            icon: "🌤️"
        }
    );
}


/*
    Allows controls.js to force a player
    back to their active bouquet.
*/

export function setPlayerView(
    playerIndex,
    view
) {

    viewingBouquet.set(
        playerIndex,
        view
    );

}


function createFlowerCard(
    flower,
    {
        clickable = false,
        onClick = null
    } = {}
) {

    const card =
        document.createElement("div");


    card.className =
        "flower-card";

    card.dataset.flowerId =
        flower.flowerId;


    if (clickable) {

        card.classList.add(
            "selectable"
        );


        card.onclick = () => {

            if (onClick) {

                onClick(flower);

            }

        };

    }


    /*
        Flower sprite
    */

    const image =
        document.createElement("img");


    image.src =
        "../../assets/flowers/" +
        flower.name.toLowerCase() +
        ".png";


    image.alt =
        flower.name;


    /*
        Emoji fallback
    */

    const emoji =
        document.createElement("div");


    emoji.className =
        "flower-emoji";


    const metadata =
        flowerMetadata.find(
            entry =>
                entry.name === flower.name
        );

    /*
        Custom flower tooltip
    */

    const tooltip =
        document.getElementById(
            "flower-tooltip"
        );


    card.addEventListener(
        "mouseenter",
        event => {

            if (!tooltip || !metadata) {
                return;
            }


            tooltip.querySelector(
                ".tooltip-name"
            ).textContent =
                `${metadata.name} #${flower.flowerId}`;


            tooltip.querySelector(
                ".tooltip-bsp"
            ).textContent =
                `BSP: ${metadata.baseStylePoints}`;


            tooltip.querySelector(
                ".tooltip-description"
            ).textContent =
                metadata.description;


            tooltip.classList.add(
                "visible"
            );


            tooltip.style.setProperty(
                "--flower-color",
                metadata.color
            );


            updateTooltipPosition(
                event
            );

        }
    );


    card.addEventListener(
        "mousemove",
        event => {

            updateTooltipPosition(
                event
            );

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            tooltip?.classList.remove(
                "visible"
            );

        }
    );


    emoji.textContent =
        metadata?.emoji ?? "🌺";


    image.onerror = () => {

        image.style.display =
            "none";

        emoji.style.display =
            "block";

    };


    card.appendChild(
        image
    );


    card.appendChild(
        emoji
    );


    /*
        Flower name
    */

    const name =
        document.createElement("div");


    name.className =
        "flower-name";


    name.textContent =
        `${flower.name} #${flower.flowerId}`;


    card.appendChild(
        name
    );


    /*
        Turn points
    */

    const points =
        document.createElement("div");


    points.className =
        "flower-points";


    points.textContent =
        `${flower.turnPoints} SP`;


    card.appendChild(
        points
    );


    /*
        Statuses
    */

    if (
        flower.statuses.length > 0
    ) {

        const statuses =
            document.createElement("div");


        statuses.className =
            "flower-statuses";


        for (
            const status of
            flower.statuses
        ) {

            const statusElement =
                document.createElement(
                    "span"
                );


            statusElement.textContent =
                `${status.type} (${status.duration})`;


            statuses.appendChild(
                statusElement
            );

        }


        card.appendChild(
            statuses
        );

    }


    /*
        Status cooldowns
    */

    if (
        flower.statusCooldowns.length > 0
    ) {

        const cooldowns =
            document.createElement("div");


        cooldowns.className =
            "flower-statuses";


        for (
            const cooldown of
            flower.statusCooldowns
        ) {

            const cooldownElement =
                document.createElement(
                    "span"
                );


            cooldownElement.textContent =
                `${cooldown.type} cooldown (${cooldown.turnsRemaining})`;


            cooldowns.appendChild(
                cooldownElement
            );

        }


        card.appendChild(
            cooldowns
        );

    }


    return card;

}


function renderBouquet(
    container,
    bouquet,
    {
        title,
        active,
        selectable,
        onFlowerSelected
    }
) {

    container.innerHTML =
        "";


    const heading =
        document.createElement(
            "div"
        );


    heading.className =
        "bouquet-heading";


    /*
        Bouquet title
    */

    const titleElement =
        document.createElement(
            "span"
        );


    titleElement.textContent =
        title;


    heading.appendChild(
        titleElement
    );


    /*
        Total accumulated Style Points
    */

    const totalPoints =
        document.createElement(
            "span"
        );


    totalPoints.className =
        "bouquet-total-sp";


    totalPoints.textContent =
        `${bouquet.stylePoints} SP`;


    heading.appendChild(
        totalPoints
    );


    /*
        Active / Reserve badge
    */

    const badge =
        document.createElement(
            "span"
        );


    badge.className =
        active
            ? "bouquet-badge"
            : "bouquet-badge inactive";


    badge.textContent =
        active
            ? "ACTIVE"
            : "RESERVE";


    heading.appendChild(
        badge
    );


    container.appendChild(
        heading
    );


    /*
        Flowers
    */

    const flowers =
        document.createElement(
            "div"
        );


    flowers.className =
        "flowers";


    for (
        const flower of
        bouquet.flowers
    ) {

        flowers.appendChild(

            createFlowerCard(

                flower,

                {
                    clickable:
                        selectable,

                    onClick:
                        selectable
                            ? onFlowerSelected
                            : null
                }

            )

        );

    }


    container.appendChild(
        flowers
    );

}


function renderPlayer(
    panel,
    player,
    playerIndex,
    options = {}
) {

    panel.innerHTML =
        "";


    let view =
        viewingBouquet.get(
            playerIndex
        )
        ?? "active";


    /*
        During switch selection,
        force the appropriate bouquet
        to remain visible.
    */

    if (

        options.selectionMode ===
            "activeSwitch"

        &&

        options.selectingPlayer ===
            player

    ) {

        view =
            "active";

    }


    if (

        options.selectionMode ===
            "reserveSwitch"

        &&

        options.selectingPlayer ===
            player

    ) {

        view =
            "reserve";

    }


    viewingBouquet.set(
        playerIndex,
        view
    );


    /*
        Player header
    */

    const header =
        document.createElement(
            "div"
        );


    header.className =
        "player-header";


    const name =
        document.createElement(
            "h2"
        );


    name.textContent =
        player.name;


    header.appendChild(
        name
    );


    panel.appendChild(
        header
    );


    /*
        Active / Reserve toggle
    */

    const toggle =
        document.createElement(
            "div"
        );


    toggle.className =
        "bouquet-toggle";


    const activeButton =
        document.createElement(
            "button"
        );


    activeButton.className =
        view === "active"
            ? "toggle-button selected"
            : "toggle-button";


    activeButton.textContent =
        "Active";


    const reserveButton =
        document.createElement(
            "button"
        );


    reserveButton.className =
        view === "reserve"
            ? "toggle-button selected"
            : "toggle-button";


    reserveButton.textContent =
        "Reserve";


    /*
        Lock the toggle while the player
        is actively selecting a flower.
    */

    const selectionInProgress =

        options.selectingPlayer ===
            player

        &&

        (
            options.selectionMode ===
                "activeSwitch"

            ||

            options.selectionMode ===
                "reserveSwitch"
        );


    activeButton.disabled =
        selectionInProgress;


    reserveButton.disabled =
        selectionInProgress;


    activeButton.onclick = () => {

        viewingBouquet.set(
            playerIndex,
            "active"
        );


        renderGame(
            options.game
        );

    };


    reserveButton.onclick = () => {

        viewingBouquet.set(
            playerIndex,
            "reserve"
        );


        renderGame(
            options.game
        );

    };


    toggle.appendChild(
        activeButton
    );


    toggle.appendChild(
        reserveButton
    );


    panel.appendChild(
        toggle
    );


    /*
        Currently visible bouquet
    */

    const bouquetContainer =
        document.createElement(
            "div"
        );


    bouquetContainer.className =
        "visible-bouquet";


    const bouquet =
        view === "active"
            ? player.activeBouquet
            : player.reserveBouquet;


    /*
        Flowers are clickable only during
        the appropriate switch phase.
    */

    const selectable =

        options.selectingPlayer ===
            player

        &&

        (

            (
                options.selectionMode ===
                    "activeSwitch"

                &&

                view === "active"
            )

            ||

            (
                options.selectionMode ===
                    "reserveSwitch"

                &&

                view === "reserve"
            )

        );


    renderBouquet(

        bouquetContainer,

        bouquet,

        {

            title:
                view === "active"
                    ? "Active Bouquet"
                    : "Reserve Bouquet",

            active:
                view === "active",

            selectable,

            onFlowerSelected:
                selectable
                    ? options.onFlowerSelected
                    : null

        }

    );


    panel.appendChild(
        bouquetContainer
    );

}


export function renderGame(
    game,
    options = {}
) {

    if (!game) {

        return;

    }


    /*
        Make the game available to
        callbacks inside renderPlayer().
    */

    options.game =
        game;


    /*
        Turn
    */

    const turnNumber =
        document.getElementById(
            "turnNumber"
        );


    const timeRemaining =
        document.getElementById(
            "timeRemaining"
        );


    const timeBadge =
        document.getElementById(
            "timeBadge"
        );


    /*
        Weather
    */

    const weatherName =
        document.getElementById(
            "weatherName"
        );


    const weatherValue =
        document.getElementById(
            "weatherValue"
        );


    const weatherIcon =
        document.getElementById(
            "weatherIcon"
        );


    const weatherBadge =
        document.getElementById(
            "weatherBadge"
        );


    if (turnNumber) {

        turnNumber.textContent =
            game.turn;

    }


    if (timeRemaining) {

        timeRemaining.textContent =
            `${game.timeRemaining} turns`;

    }


    if (timeBadge) {

        timeBadge.textContent =
            game.time.toUpperCase();

    }


    /*
        Game.getWeather() returns a string.
        game.weather is the numerical pointer.
    */

    const weather =
        game.getWeather();


    const weatherDisplay =
        getWeatherDisplay(
            weather
        );


    if (weatherName) {

        weatherName.textContent =
            weatherDisplay.name;

    }


    if (weatherValue) {

        weatherValue.textContent =
            game.weather;

    }


    if (weatherIcon) {

        weatherIcon.textContent =
            weatherDisplay.icon;

    }


    if (weatherBadge) {

        weatherBadge.textContent =
            weatherDisplay.name;

    }


    /*
        Player panels
    */

    const player0Panel =
        document.getElementById(
            "player0Panel"
        );


    const player1Panel =
        document.getElementById(
            "player1Panel"
        );


    if (
        game.players[0] &&
        player0Panel
    ) {

        renderPlayer(

            player0Panel,

            game.players[0],

            0,

            options

        );

    }


    if (
        game.players[1] &&
        player1Panel
    ) {

        renderPlayer(

            player1Panel,

            game.players[1],

            1,

            options

        );

    }

}


export function flashFlower(
    flower,
    color
) {

    return new Promise(
        resolve => {

            const card =
                document.querySelector(
                    `.flower-card[data-flower-id="${flower.flowerId}"]`
                );


            if (!card) {

                resolve();

                return;

            }


            card.style.setProperty(
                "--flower-flash-color",
                color
            );


            card.classList.remove(
                "flower-active"
            );


            void card.offsetWidth;


            card.classList.add(
                "flower-active"
            );


            setTimeout(() => {

                card.classList.remove(
                    "flower-active"
                );


                resolve();

            }, 400);

        }
    );

}

function updateTooltipPosition(event) {

    const tooltip =
        document.getElementById(
            "flower-tooltip"
        );


    if (!tooltip) {
        return;
    }


    const offset = 14;


    let x =
        event.clientX + offset;

    let y =
        event.clientY + offset;


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