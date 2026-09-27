const logElement =
    document.getElementById(
        "log"
    );

export function print(
    message = ""
) {

    const line =
        document.createElement(
            "div"
        );


    line.className =
        "log-line";


    line.textContent =
        message;


    logElement.appendChild(
        line
    );

    
    logElement.scrollTop =
        logElement.scrollHeight;
}