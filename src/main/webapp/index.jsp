<%@ page contentType="text/html;charset=UTF-8" %>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lab №2</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="header">
    <h1 id="name">Авдеев Владислав Александрович</h1>
    <h2>Группа: P3214</h2>
    <h2>Вариант: 464917</h2>
</div>
<div id="graphicInput">
    <div id="graphic">
        <svg height="500" width="500" xmlns="http://www.w3.org/2000/svg" id="graph-svg">

            <line stroke="#A1A6B4" x1="0" x2="500" y1="250" y2="250" stroke-width="1"></line>
            <line stroke="#A1A6B4" x1="250" x2="250" y1="0" y2="500" stroke-width="1"></line>

            <polygon fill="white" points="250,0 245,13 255,13" stroke="#A1A6B4"></polygon>
            <polygon fill="white" points="500,250 487,245 487,255" stroke="#A1A6B4"></polygon>

            <!-- Засечки вправо по оси X -->
            <line stroke="#A1A6B4" x1="330" x2="330" y1="255" y2="245" stroke-width="1"></line>
            <line stroke="#A1A6B4" x1="410" x2="410" y1="255" y2="245" stroke-width="1"></line>

            <!-- Засечки влево по оси X -->
            <line stroke="#A1A6B4" x1="170" x2="170" y1="255" y2="245" stroke-width="1"></line>
            <line stroke="#A1A6B4" x1="90" x2="90" y1="255" y2="245" stroke-width="1"></line>

            <!-- Засечки вверх по оси Y -->
            <line stroke="#A1A6B4" x1="255" x2="245" y1="170" y2="170" stroke-width="1"></line>
            <line stroke="#A1A6B4" x1="255" x2="245" y1="90" y2="90" stroke-width="1"></line>

            <!-- Засечки вниз по оси Y -->
            <line stroke="#A1A6B4" x1="255" x2="245" y1="330" y2="330" stroke-width="1"></line>
            <line stroke="#A1A6B4" x1="255" x2="245" y1="410" y2="410" stroke-width="1"></line>

            <rect x="250" y="90" width="80" height="160" fill="#B4D2E7" fill-opacity="0.8" stroke="#000000"></rect>

            <polygon fill="#B4D2E7" fill-opacity="0.8" points="250,250 330,250 250,410" stroke="#000000"></polygon>

            <path d="M 250 410 A 160, 160, 0, 0, 1, 90 250 L 250 250 Z" fill-opacity="0.8" fill="#B4D2E7" stroke="#000000"></path>

            <%-- Подписи координат к засечкам на осях X и Y --%>
            <text fill="#A1A6B4" x="318" y="240" font-family="sans-serif" class="textSvg2">R/2</text>
            <text fill="#A1A6B4" x="405" y="240" font-family="sans-serif" class="textSvg">R</text>

            <text fill="#A1A6B4" x="152" y="240" font-family="sans-serif" class="textSvgM2">-R/2</text>
            <text fill="#A1A6B4" x="80" y="240" font-family="sans-serif" class="textSvgM">-R</text>

            <text fill="#A1A6B4" x="260" y="175" font-family="sans-serif" class="textSvg2">R/2</text>
            <text fill="#A1A6B4" x="260" y="95" font-family="sans-serif" class="textSvg">R</text>

            <text fill="#A1A6B4" x="260" y="334" font-family="sans-serif" class="textSvgM2">-R/2</text>
            <text fill="#A1A6B4" x="260" y="414" font-family="sans-serif" class="textSvgM">-R</text>

            <text fill="#A1A6B4" x="490" y="240" font-family="sans-serif" class="textSvgAxes">x</text>
            <text fill="#A1A6B4" x="260" y="10" font-family="sans-serif" class="textSvgAxes">y</text>

            <circle cx="250" cy="250" r="3" fill="red"></circle>
        </svg>
        <div id='rValue'></div>
        <div id='coordinates'></div>
    </div>
    <div>
        <form action="ControllerServlet" method="get" id="formStyle">
            <div>
                <label for="xSelect">Выберите X для графика:</label>
                <select id="xSelect" name="x">
                    <option value="-2">-2</option>
                    <option value="-1.5">-1.5</option>
                    <option value="-1">-1</option>
                    <option value="-0.5">-0.5</option>
                    <option value="0">0</option>
                    <option value="0.5">0.5</option>
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                </select>
            </div>
            <%
                Boolean errorX = (Boolean) request.getAttribute("errorX");
                if (errorX != null && errorX.equals(true)) {
            %>
            <div id="error" style="color: red; font-weight: bold;">Некорректное значение X</div>
            <%
                }
            %>
            <br>
            <div id="blockY">
                <label for="inputY">Введите значение Y:</label>
                <input type="number" step="any" name="y" id="inputY" placeholder="от -5 до 3" />
            </div>
            <%
                Boolean errorY = (Boolean) request.getAttribute("errorY");
                if (errorY != null && errorY.equals(true)) {
            %>
            <div id="error" style="color: red; font-weight: bold;">Некорректное значение Y</div>
            <%
                }
            %>
            <br>
            <div>
                <label for="rSelect">Выберите R для графика:</label>
                <select id="rSelect" name="r">
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                    <option value="2.5">2.5</option>
                </select>
            </div>
            <%
                Boolean errorR = (Boolean) request.getAttribute("errorR");
                if (errorR != null && errorR.equals(true)) {
            %>
            <div id="error" style="color: red; font-weight: bold;">Некорректное значение R</div>
            <%
                }
            %>
            <br>
            <div>
                <button id="buttonSend" type="submit">Отправить X, Y, R</button>
            </div>
        </form>
        <form action="ControllerServlet" method="get" id="clearFormStyle">
            <input type="hidden" name="action" value="clearHistory">
            <div>
                <button id="buttonClearHistory" type="submit">Очистить результаты</button>
            </div>
        </form>
    </div>
</div>

<h2 id="textResults">Результаты:</h2>
<jsp:include page="resultTable.jsp"/>

<script src="main.js"></script>
</body>