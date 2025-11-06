<%@ page import="java.util.ArrayList" %>
<%@ page import="recource.Point" %>
<%@ page import="java.math.BigDecimal" %>
<%@ page import="java.math.RoundingMode" %>
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <title>Table</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<table id="resultsTable">
    <tr>
        <th><h3 class="headerOfTable">X</h3></th>
        <th><h3 class="headerOfTable">Y</h3></th>
        <th><h3 class="headerOfTable">R</h3></th>
        <th><h3 class="headerOfTable">Ответ</h3></th>
        <th><h3 class="headerOfTable">Время выполнения</h3></th>
        <th><h3 class="headerOfTable">Время на сервере</h3></th>
    </tr>
    <%
        @SuppressWarnings("unchecked")
        ArrayList<Point> results = (ArrayList<Point>) session.getAttribute("historyPoint");
        if (results != null) {
            for (Point point : results) {
                BigDecimal x = point.getX().setScale(5, RoundingMode.HALF_UP).stripTrailingZeros();
                BigDecimal y = point.getY().setScale(5, RoundingMode.HALF_UP).stripTrailingZeros();
                BigDecimal r = point.getR().setScale(5, RoundingMode.HALF_UP).stripTrailingZeros();
    %>
    <tr>
        <td><%= x.toPlainString() %></td>
        <td><%= y.toPlainString() %></td>
        <td><%= r.toPlainString() %></td>
        <td><%= point.getInReg() ? "Входит" : "Не входит" %></td>
        <td><%= point.getLeadTime() %></td>
        <td><%= point.getServerTime() %></td>
    </tr>
    <%
            }
        }
    %>
</table>
</body>
</html>