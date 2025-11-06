package recource;

import java.math.BigDecimal;
import java.util.Objects;

public class Point {
    private final BigDecimal x;
    private final BigDecimal y;
    private final BigDecimal r;
    private final boolean inReg;
    private final String leadTime;
    private final String serverTime;

    public Point(BigDecimal x, BigDecimal y, BigDecimal r, boolean inReg, String leadTime, String serverTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.inReg = inReg;
        this.leadTime = leadTime;
        this.serverTime = serverTime;
    }

    public BigDecimal getX() {
        return x;
    }

    public BigDecimal getY() {
        return y;
    }

    public BigDecimal getR() {
        return r;
    }

    public boolean getInReg() {
        return inReg;
    }

    public String getLeadTime() {
        return leadTime;
    }

    public String getServerTime() {
        return serverTime;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Point point = (Point) o;
        return Objects.equals(x, point.x) && Objects.equals(y, point.y) && Objects.equals(r, point.r);
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y, r);
    }
}
