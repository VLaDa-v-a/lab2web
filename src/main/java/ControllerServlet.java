import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;


@WebServlet("/ControllerServlet")
public class ControllerServlet extends HttpServlet {
    Validator validator = new Validator();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String xStr = request.getParameter("x");
        String yStr = request.getParameter("y");
        String rStr = request.getParameter("r");
        String action = request.getParameter("action");

        if ("getHistory".equals(action)) {
            request.getRequestDispatcher("/AreaCheckServlet?" + request.getQueryString()).forward(request, response);
        } else if ("getHistoryWithR".equals(action)) {
            request.getRequestDispatcher("/AreaCheckServlet?" + request.getQueryString()).forward(request, response);
        } else if ("clearHistory".equals(action)) {
            request.getRequestDispatcher("/AreaCheckServlet?" + request.getQueryString()).forward(request, response);
        } else if ((validator.checkRequestError(xStr, yStr, rStr).stream().allMatch(f -> f == false)) || "svg".equals(action)) {

            System.out.println(xStr);
            System.out.println(yStr);
            System.out.println(rStr);

            request.getRequestDispatcher("/AreaCheckServlet?" + request.getQueryString()).forward(request, response);
        } else {
            ArrayList<Boolean> errors = validator.checkRequestError(xStr, yStr, rStr);
            request.setAttribute("error", "Некорректные параметры");
            if (errors.get(0) == true) {
                request.setAttribute("errorX", true);
            }
            if (errors.get(1) == true) {
                request.setAttribute("errorY", true);
            }
            if (errors.get(2) == true) {
                request.setAttribute("errorR", true);
            }
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }
}
