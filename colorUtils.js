// Handles all color generation logic负责所有颜色计算相关的逻辑

// Color class represents a single color in the palette
// 每张色卡对应一个 Color 实例
class Color {
    constructor(hex) {
        // The hex value of this color, e.g. "E88D3E"
        this.hex = hex;

        // Color name fetched from The Color API — empty for now
        // 颜色名称，Phase 4 会通过 API 填入
        this.name = "";

        // Whether this color is locked by the user
        // 是否被用户锁定，默认 false
        this.locked = false;
    }
}

// Converts HSL values to a hex color string
// 把 HSL 数值转换成 hex 字符串，例如 "E88D3E"
function hslToHex(h, s, l) {
    // Convert percentages to 0–1 range
    s /= 100;
    l /= 100;

    // Standard formula to convert HSL to RGB
    // 标准公式，把 HSL 转成 RGB
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    // Convert each RGB channel (0–1) to a 2-digit hex value
    // 把每个 RGB 通道转成两位 hex
    const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, "0");

    return `${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

// export allows this function to be imported in other files让其他文件可以 import
export function generatePalette(harmonyMode) {
    // Pick a random base hue between 0 and 360
    // 随机选一个基础色相（0–360度）
    const baseHue = Math.floor(Math.random() * 360);

    // Fixed saturation and lightness for all colors in the palette
    // 所有颜色使用相同的饱和度和明度，保证整体和谐
    const s = 65;
    const l = 55;

    // Calculate 5 hues based on the selected harmony mode
    // 根据 harmony 模式计算五个色相
    let hues = [];

    if (harmonyMode === "analogous") {
        // Analogous: 5 colors spaced 30° apart
        // 类似色：五个颜色间隔30度
        hues = [
            baseHue,
            (baseHue + 30) % 360,
            (baseHue + 60) % 360,
            (baseHue - 30 + 360) % 360,
            (baseHue - 60 + 360) % 360,
        ];
    } else if (harmonyMode === "complementary") {
        // Complementary: base + its opposite (180°), with variations
        // 互补色：基础色和对面的颜色（相差180度）
        hues = [
            baseHue,
            (baseHue + 30) % 360,
            (baseHue - 30 + 360) % 360,
            (baseHue + 180) % 360,
            (baseHue + 210) % 360,
        ];
    } else if (harmonyMode === "triadic") {
        // Triadic: 3 colors evenly spaced 120° apart, with 2 variations
        // 三角配色：三个颜色均匀分布在色相环上（相差120度）
        hues = [
            baseHue,
            (baseHue + 120) % 360,
            (baseHue + 240) % 360,
            (baseHue + 150) % 360,
            (baseHue + 270) % 360,
        ];
    } else if (harmonyMode === "split-comp") {
        // Split-complementary: base + two colors adjacent to its complement
        // 分裂互补色：基础色 + 互补色两侧的颜色
        hues = [
            baseHue,
            (baseHue + 150) % 360,
            (baseHue + 210) % 360,
            (baseHue + 30) % 360,
            (baseHue - 30 + 360) % 360,
        ];
    }

    // Convert each hue to a hex value and create a new Color instance
    // 把每个色相转成 hex，并创建对应的 Color 实例
    return hues.map((h) => new Color(hslToHex(h, s, l)));
}