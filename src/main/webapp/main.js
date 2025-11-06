let x = null;
let y = null;
let r = null;
let action = null;

const svgElement = document.getElementById('graph-svg');
const coordinatesDiv = document.getElementById('coordinates');


function sendRequest() {
    loadLastR().then(newR => {
        const currentR = newR !== null ? newR : r;

        const params = new URLSearchParams({
            x: String(x ?? ''),
            y: String(y ?? ''),
            r: String(currentR ?? ''),
            action: String(action ?? '')
        });

        console.log("Отправляемые параметры:", params.toString());

        fetch(`ControllerServlet?${params.toString()}`, {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка сети или сервера');
                return response.text();
            })
            .then(result => {
                const jsonResult = JSON.parse(result);

                addRowToTable(jsonResult);

                drawCircle(x, y, currentR, jsonResult.inReg);

            })
            .catch(error => {
                console.error('Ошибка при отправке запроса:', error);
            });
    }).catch(error => {
        console.error('Ошибка при загрузке истории:', error);
    });
}


/**
 * @param {{x: number, y: number, r: number, inReg: boolean, timeExecution: string, serverTime: string}} jsonResult - результат запроса
 */
function addRowToTable(jsonResult) {
    const table = document.getElementById("resultsTable");
    const newRow = table.insertRow();

    const xCell = newRow.insertCell(0);
    const yCell = newRow.insertCell(1);
    const rCell = newRow.insertCell(2);
    const answerCell = newRow.insertCell(3);
    const executionTimeCell = newRow.insertCell(4);
    const serverTimeCell = newRow.insertCell(5);

    xCell.innerText = parseFloat(jsonResult.x.toFixed(5)).toString();
    yCell.innerText = parseFloat(jsonResult.y.toFixed(5)).toString();
    rCell.innerText = parseFloat(jsonResult.r.toFixed(5)).toString();
    answerCell.innerText = jsonResult.inReg ? "Входит" : "Не входит";
    executionTimeCell.innerText = jsonResult.timeExecution;
    serverTimeCell.innerText = jsonResult.serverTime;
}


function loadLastR() {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams({
            action: 'getHistory'
        });

        fetch(`ControllerServlet?${params.toString()}`, { method: 'GET' })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка сети или сервера');
                return response.json();
            })
            .then(history => {
                if (history && history.length > 0) {
                    const lastR = history[history.length - 1].r;
                    r = lastR;
                    document.getElementById("rSelect").value = r;
                    console.log('Загружено последнее R:', r);
                    resolve(lastR);
                } else {
                    console.log('История пуста, используем текущее R:', r);
                    resolve(null);
                }
            })
            .catch(error => {
                console.error('Ошибка при получении истории:', error);
                reject(error);
            });
    });
}


/**
 * @typedef {Object} point
 * @property {number} x
 * @property {number} y
 * @property {boolean} inReg
 */
function drawAllCircle() {
    const params = new URLSearchParams({
        action: 'getHistoryWithR',
        r: String(r ?? '')
    });

    fetch(`ControllerServlet?${params.toString()}`, { method: 'GET' })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сети или сервера');
            return response.json();
        })
        .then(history => {
            if (history && history.length > 0) {
                for (const point of history) {
                    const xHistory = point.x;
                    const yHistory = point.y;
                    const answerHistory = point.inReg;

                    drawCircle(xHistory, yHistory, r, answerHistory)
                }
            } else {
                console.log('История пуста, график соответственно тоже', r);
            }
        })
        .catch(error => {
            console.error('Ошибка при получении истории:', error);
        });
}


function drawCircle(x, y, r, answer) {
    const svgElement = document.getElementById('graph-svg');
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", ((parseFloat(x) * 320 / (2 * parseFloat(r))) + 250).toString());
    circle.setAttribute("cy", ((parseFloat(y) * 320 / (2 * parseFloat(r)) * -1) + 250).toString());
    circle.setAttribute("r", "5");

    circle.setAttribute("fill", answer ? "green" : "red");
    svgElement.appendChild(circle);
}


svgElement.addEventListener('click', function (event) {
    const rect = svgElement.getBoundingClientRect();
    const xGraph = event.clientX - rect.left;
    const yGraph = event.clientY - rect.top;

    r = document.getElementById("rSelect").value;

    const calcX = ((xGraph - 250) / 320 * 2 * r);
    const calcY = ((yGraph - 250) / 320 * -1 * 2 * r);

    coordinatesDiv.textContent = `Координаты клика: X: ${parseFloat(calcX.toFixed(5))}, Y: ${parseFloat(calcY.toFixed(5))}`;

    x = calcX.toFixed(20);
    y = calcY.toFixed(20);

    action = "svg";

    sendRequest();
});


document.addEventListener('DOMContentLoaded', function() {
    const rValueDiv = document.getElementById('rValue');

    loadLastR().then(lastR => {
        if (lastR !== null) {
            console.log('Начальное значение R установлено:', lastR);
        } else {
            lastR = 1;
        }
        rValueDiv.textContent = `Нынешнее значение R: ${lastR}`;
        r = lastR;
        document.querySelectorAll(".textSvg").forEach(t => t.textContent = `${parseFloat(lastR.toFixed(5))}`);
        document.querySelectorAll(".textSvg2").forEach(t => t.textContent = `${parseFloat((lastR / 2).toFixed(5))}`);
        document.querySelectorAll(".textSvgM").forEach(t => t.textContent = `${parseFloat((-lastR).toFixed(5))}`);
        document.querySelectorAll(".textSvgM2").forEach(t => t.textContent = `${parseFloat((-lastR / 2).toFixed(5))}`);

        drawAllCircle();

    }).catch(() => {
        console.log('Не удалось загрузить начальное R');
    });
});