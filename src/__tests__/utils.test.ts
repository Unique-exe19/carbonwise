import {
  cn,
  formatNumber,
  formatCO2,
  getRelativeTime,
  percentage,
  getInitials,
  stringToColor,
  debounce,
} from "../lib/utils";

describe("Utility helper functions", () => {
  describe("cn", () => {
    it("should merge tailwind classes cleanly", () => {
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });
  });

  describe("formatNumber", () => {
    it("should format number correctly with decimals", () => {
      expect(formatNumber(1234.56, 1)).toBe("1,234.6");
      expect(formatNumber(100, 0)).toBe("100");
    });
  });

  describe("formatCO2", () => {
    it("should display g for < 1kg CO2", () => {
      expect(formatCO2(0.5)).toBe("500g CO₂");
    });

    it("should display 0g for 0kg CO2", () => {
      expect(formatCO2(0)).toBe("0g CO₂");
    });

    it("should display kg for normal amounts", () => {
      expect(formatCO2(250)).toBe("250kg CO₂");
    });

    it("should display tonnes for >= 1000kg CO2", () => {
      expect(formatCO2(1500)).toBe("1.5t CO₂");
    });
  });

  describe("getRelativeTime", () => {
    it("should display just now for recent dates", () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe("just now");
    });

    it("should display m ago for minutes diff", () => {
      const twoMinsAgo = new Date(Date.now() - 120000);
      expect(getRelativeTime(twoMinsAgo)).toBe("2m ago");
    });
  });

  describe("percentage", () => {
    it("should compute safe percentage", () => {
      expect(percentage(50, 100)).toBe(50);
      expect(percentage(150, 100)).toBe(100);
      expect(percentage(50, 0)).toBe(0);
    });

    it("should bound negative percentages to 0", () => {
      expect(percentage(-50, 100)).toBe(0);
    });

    it("should bound percentages exceeding 100 to 100", () => {
      expect(percentage(200, 100)).toBe(100);
    });
  });

  describe("getInitials", () => {
    it("should return initials of name", () => {
      expect(getInitials("John Doe")).toBe("JD");
      expect(getInitials(null)).toBe("?");
    });
  });

  describe("stringToColor", () => {
    it("should convert seed string to hsl", () => {
      const color = stringToColor("Eco");
      expect(color).toContain("hsl(");
    });
  });

  describe("debounce", () => {
    jest.useFakeTimers();

    it("should debounce function calls", () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced();
      debounced();

      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
    });
  });
});
