import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;

public class Validator {
    public ArrayList<Boolean> checkRequestError(String x, String y, String r) {
        boolean flagErrorX = false;
        boolean flagErrorY = false;
        boolean flagErrorR = false;

        if (x == null || x.isEmpty()) {
            flagErrorX = true;
        }

        if (y == null || y.isEmpty() || checkBoundaries(new BigDecimal(y), new BigDecimal(-5), new BigDecimal(3))) {
            flagErrorY = true;
        }

        if (r == null || r.isEmpty()) {
            flagErrorR = true;
        }

        return new ArrayList<>(Arrays.asList(flagErrorX, flagErrorY, flagErrorR));
    }

    private boolean checkBoundaries(BigDecimal value, BigDecimal left, BigDecimal right) {
        return (value.compareTo(left) < 0) || (value.compareTo(right) > 0);
    }
}
