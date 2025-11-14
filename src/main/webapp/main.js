let x = null;
let y = null;
let r = null;
let action = null;

const svgGraph = document.getElementById("graph-svg");
const overlay = document.getElementById("click-overlay");
const svgPage = document.getElementById("page-overlay-svg");
const coordinatesDiv = document.getElementById("coordinates");

let drawnPoints = [];
let errorCount = 0;
let audio = new Audio('He_a_Pirate.mp3');
let musicPlaying = false;


async function sendRequest() {
    try {
        const newR = await loadLastR();
        const currentR = newR !== null ? newR : r;

        const params = new URLSearchParams({
            x: String(x ?? ""),
            y: String(y ?? ""),
            r: String(currentR ?? ""),
            action: String(action ?? "")
        });

        const response = await fetch("ControllerServlet?" + params.toString(), { method: "GET" });
        if (!response.ok) throw new Error("Ошибка сети или сервера");

        const result = await response.text();
        const jsonResult = JSON.parse(result);

        addRowToTable(jsonResult);

        drawnPoints.push({
            x: parseFloat(jsonResult.x),
            y: parseFloat(jsonResult.y),
            r: parseFloat(jsonResult.r),
            inReg: jsonResult.inReg
        });

        redrawAllPoints();
    } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
    }
}


function loadLastR() {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams({ action: "getHistory" });

        fetch("ControllerServlet?" + params.toString(), { method: "GET" })
            .then(response => {
                if (!response.ok) throw new Error("Ошибка сети или сервера");
                return response.json();
            })
            .then(history => {
                if (history && history.length > 0) {
                    const lastR = parseFloat(history[history.length - 1].r);
                    r = lastR;
                    const rSelect = document.getElementById("rSelect");
                    if (rSelect) rSelect.value = r;
                    resolve(lastR);
                } else {
                    resolve(null);
                }
            })
            .catch(error => {
                console.error("Ошибка при получении истории:", error);
                reject(error);
            });
    });
}


function drawAllCircle() {
    const params = new URLSearchParams({
        action: "getHistoryWithR",
        r: String(r ?? "")
    });

    fetch("ControllerServlet?" + params.toString(), { method: "GET" })
        .then(response => {
            if (!response.ok) throw new Error("Ошибка сети или сервера");
            return response.json();
        })
        .then(history => {
            if (history && history.length > 0) {
                drawnPoints = [];
                for (const point of history) {
                    drawnPoints.push({
                        x: parseFloat(point.x),
                        y: parseFloat(point.y),
                        r: parseFloat(point.r ?? r),
                        inReg: point.inReg
                    });
                }
                redrawAllPoints();
            } else {
                drawnPoints = [];
                redrawAllPoints();
            }
        })
        .catch(error => console.error("Ошибка при получении истории:", error));
}


function drawCircle(x, y, r, answer) {
    const graphRect = svgGraph.getBoundingClientRect();

    const centerX = graphRect.left + graphRect.width / 2;
    const centerY = graphRect.top + graphRect.height / 2;

    const px = centerX + (x * 320 / (2 * r));
    const py = centerY - (y * 320 / (2 * r));

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", px.toString());
    circle.setAttribute("cy", py.toString());
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", answer ? "green" : "red");
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "1");

    svgPage.appendChild(circle);
}

function redrawAllPoints() {
    svgPage.innerHTML = "";
    drawnPoints.forEach(point => drawCircle(point.x, point.y, point.r, point.inReg));
}


function playErrorSound() {
    if (!musicPlaying) {
        audio.loop = true;
        audio.play().then(() => {
            musicPlaying = true;
            console.log("Музыка начала играть");
        }).catch(err => {
            console.error("Ошибка при воспроизведении музыки: ", err);
        });
    }
    audio.volume = Math.min(1, 0.01 + errorCount * 0.01);
}


function stopErrorSound() {
    if (musicPlaying) {
        audio.pause();
        audio.currentTime = 0; // Сбрасываем на начало
        musicPlaying = false;
        audio.volume = 0.1;
        errorCount = 0;
    }
}


overlay.addEventListener("click", async function (event) {
    if (event.target.closest("form") ||
        event.target.closest("button") ||
        event.target.closest("select") ||
        event.target.closest("input")) {
        return;
    }

    const graphRect = svgGraph.getBoundingClientRect();
    const centerX = graphRect.left + graphRect.width / 2;
    const centerY = graphRect.top + graphRect.height / 2;

    // Смещения относительно центра графика
    const offsetX = event.clientX - centerX;
    const offsetY = event.clientY - centerY;

    r = parseFloat(document.getElementById("rSelect").value);

    const calcX = offsetX * (2 * r) / 320;
    const calcY = -offsetY * (2 * r) / 320;

    x = calcX.toFixed(20);
    y = calcY.toFixed(20);
    action = "svg";

    coordinatesDiv.textContent =
        `Координаты крайнего клика: X: ${calcX.toFixed(5)}, Y: ${calcY.toFixed(5)}`;

    await sendRequest();

    const point = drawnPoints[drawnPoints.length - 1];
    if (!point.inReg) {
        errorCount++;
        playErrorSound();
    } else {
        stopErrorSound();
    }
});


function addRowToTable(jsonResult) {
    const table = document.getElementById("resultsTable");
    if (!table) return;

    const newRow = table.insertRow();

    const xCell = newRow.insertCell(0);
    const yCell = newRow.insertCell(1);
    const rCell = newRow.insertCell(2);
    const answerCell = newRow.insertCell(3);
    const executionTimeCell = newRow.insertCell(4);
    const serverTimeCell = newRow.insertCell(5);

    xCell.innerText = parseFloat(jsonResult.x).toString();
    yCell.innerText = parseFloat(jsonResult.y).toString();
    rCell.innerText = parseFloat(jsonResult.r).toString();
    answerCell.innerText = jsonResult.inReg ? "Входит" : "Не входит";
    executionTimeCell.innerText = jsonResult.timeExecution;
    serverTimeCell.innerText = jsonResult.serverTime;

    setTimeout(redrawAllPoints, 0);
}


document.addEventListener("DOMContentLoaded", function () {

    const rValueDiv = document.getElementById("rValue");

    loadLastR().then(lastR => {
        let usedR = lastR;
        if (usedR === null) {
            usedR = 1;
            r = usedR;
        }

        if (rValueDiv) {
            rValueDiv.textContent = `Нынешнее значение R: ${usedR}`;
        }

        document.querySelectorAll(".textSvg").forEach(t => t.textContent = `${parseFloat(usedR.toFixed(5))}`);
        document.querySelectorAll(".textSvg2").forEach(t => t.textContent = `${parseFloat((usedR / 2).toFixed(5))}`);
        document.querySelectorAll(".textSvgM").forEach(t => t.textContent = `${parseFloat((-usedR).toFixed(5))}`);
        document.querySelectorAll(".textSvgM2").forEach(t => t.textContent = `${parseFloat((-usedR / 2).toFixed(5))}`);

        drawAllCircle();
    }).catch(() => {
        console.log("Не удалось загрузить начальное R");
    });

    const clearBtn = document.getElementById("buttonClearHistory");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            drawnPoints = [];
            svgPage.innerHTML = "";
        });
    }
});

document.getElementById("formStyle").addEventListener("submit", function(event) {
    errorCount = 0;
    stopErrorSound();
});

window.addEventListener("scroll", redrawAllPoints);
window.addEventListener("resize", redrawAllPoints);
