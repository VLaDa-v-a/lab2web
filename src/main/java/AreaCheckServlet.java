import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import recource.Point;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


@WebServlet("/AreaCheckServlet")
public class AreaCheckServlet extends HttpServlet {

    private static final MathContext rounding = new MathContext(25, RoundingMode.HALF_UP);
    static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public void init() throws ServletException {
        super.init();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        long startTime = System.nanoTime();

        var action = request.getParameter("action");

        System.out.println("action: " + action);

        if ("getHistory".equals(action)) {
            var ses = request.getSession();
            @SuppressWarnings("unchecked")
            ArrayList<Point> history = (ArrayList<Point>) ses.getAttribute("historyPoint");

            var gson = new Gson();
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(history != null ? history : new ArrayList<>()));
        } else if ("getHistoryWithR".equals(action)) {
            var ses = request.getSession();
            var newR = new BigDecimal(request.getParameter("r"));
            @SuppressWarnings("unchecked")
            ArrayList<Point> history = (ArrayList<Point>) ses.getAttribute("historyPoint");
            ArrayList<Point> historyCopy = new ArrayList<>();
            if (history != null) {
                for (Point point : history) {
                    historyCopy.add(new Point(point.getX(), point.getY(), point.getR(), point.getInReg(), point.getLeadTime(), point.getServerTime()));
                }
            }
            for (int i = 0; i < historyCopy.size(); i++) {
                Point oldPoint = historyCopy.get(i);
                boolean insideRectangle = isInsideRectangle(oldPoint.getX(), oldPoint.getY(), BigDecimal.valueOf(0), BigDecimal.valueOf(0), newR.divide(BigDecimal.valueOf(2), rounding), newR);
                boolean insidePolygon = isInsidePolygon(oldPoint.getX(), oldPoint.getY(), newR);
                boolean insidePath = isInsidePath(oldPoint.getX(), oldPoint.getY(), newR);
                Point newPoint = new Point(
                        oldPoint.getX(),
                        oldPoint.getY(),
                        newR,
                        insideRectangle || insidePolygon || insidePath,
                        String.valueOf(System.nanoTime() - startTime),
                        LocalDateTime.now().format(formatter)
                );
                historyCopy.set(i, newPoint);
            }
            var gson = new Gson();
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(historyCopy));
        } else if ("clearHistory".equals(action)) {
            var session = request.getSession();
            session.setAttribute("historyPoint", null);
            response.sendRedirect("index.jsp");
        } else {
            BigDecimal x = new BigDecimal(request.getParameter("x"));
            BigDecimal y = new BigDecimal(request.getParameter("y"));
            BigDecimal r = new BigDecimal(request.getParameter("r"));

            boolean insideRectangle = isInsideRectangle(x, y, BigDecimal.valueOf(0), BigDecimal.valueOf(0), r.divide(BigDecimal.valueOf(2), rounding), r);
            boolean insidePolygon = isInsidePolygon(x, y, r);
            boolean insidePath = isInsidePath(x, y, r);

            var session = request.getSession();
            @SuppressWarnings("unchecked")
            ArrayList<Point> historyPoint = (ArrayList<Point>) session.getAttribute("historyPoint");
            if (historyPoint == null) {
                historyPoint = new ArrayList<>();
                session.setAttribute("historyPoint", historyPoint);
            }
            historyPoint.add(new Point(x, y, r, insideRectangle || insidePolygon || insidePath, String.valueOf(System.nanoTime() - startTime), LocalDateTime.now().format(formatter)));
            session.setAttribute("historyPoint", historyPoint);

            if ("svg".equals(action)) {
                var gson = new Gson();
                Map<String, Object> json = new HashMap<>();
                json.put("x", x);
                json.put("y", y);
                json.put("r", r);
                json.put("inReg", insideRectangle || insidePolygon || insidePath);
                json.put("timeExecution", String.valueOf(System.nanoTime() - startTime));
                json.put("serverTime", LocalDateTime.now().format(formatter));
                var msg = gson.toJson(json);

                response.setContentType("application/json");
                response.getWriter().write(msg);
            } else {
                response.sendRedirect("index.jsp");
            }
        }
    }


    private static boolean isInsideRectangle(BigDecimal px, BigDecimal py, BigDecimal rectX, BigDecimal rectY, BigDecimal width, BigDecimal height) {
        return ((px.compareTo(rectX) >= 0) && (px.compareTo(rectX.add(width)) <= 0)) && ((py.compareTo(rectY) >= 0) && (py.compareTo(rectY.add(height)) <= 0));
    }

    private static boolean isInsidePolygon(BigDecimal px, BigDecimal py, BigDecimal r) {
        BigDecimal[][] polygon = {
                {r.divide(BigDecimal.valueOf(2), rounding), BigDecimal.valueOf(0)},
                {BigDecimal.valueOf(0), BigDecimal.valueOf(0)},
                {BigDecimal.valueOf(0), r.negate()}
        };

        int n = polygon.length;
        boolean inside = false;

        for (int i = 0, j = n - 1; i < n; j = i++) {
            BigDecimal xi = polygon[i][0], yi = polygon[i][1];
            BigDecimal xj = polygon[j][0], yj = polygon[j][1];


            boolean intersect = ((yi.compareTo(py) > 0) != (yj.compareTo(py) > 0)) && (px.compareTo(xj.subtract(xi).multiply(py.subtract(yi).divide((yj.subtract(yi)), rounding)).add(xi)) < 0);
            if (intersect) {
                inside = !inside;
            }
        }

        return inside;
    }

    private static boolean isInsidePath(BigDecimal x, BigDecimal y, BigDecimal r) {
        BigDecimal centerX = BigDecimal.valueOf(0);
        BigDecimal centerY = BigDecimal.valueOf(0);
        if ((x.compareTo(centerX) <= 0) && (y.compareTo(centerY) <= 0) && (x.compareTo(centerX.add(r)) <= 0) && (y.compareTo(centerY.subtract(r)) >= 0)) {
            BigDecimal distanceSquared = ((x.subtract(centerX)).pow(2)).add((y.subtract(centerY)).pow(2));
            return distanceSquared.compareTo(r.pow(2)) <= 0;
        } else {
            return false;
        }
    }
}
