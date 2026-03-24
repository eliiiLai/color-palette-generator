// Handles all color generation logic

// Color class represents a single color in the palette
class Color {
    constructor(hex) {
        // The hex value of this color, e.g. "E88D3E"
        this.hex = hex;

        // Color name fetched from The Color API — empty for now
        this.name = "";

        // Whether this color is locked by the user
        this.locked = false;
    }
}

// Converts HSL values to a hex color string
function hslToHex(h, s, l) {
    // Convert percentages to 0–1 range
    s /= 100;
    l /= 100;

    // Standard formula to convert HSL to RGB
    // Learned from: https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    // Convert each RGB channel (0–1) to a 2-digit hex value
    const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, "0");

    return `${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

// export allows this function to be imported in other files
export function generatePalette(harmonyMode) {
    // Pick a random base hue between 0 and 360
    const baseHue = Math.floor(Math.random() * 360);

    // Fixed saturation and lightness for all colors in the palette
    const s = 65;
    const l = 55;

    // Calculate 5 hues based on the selected harmony mode
    let hues = [];

    if (harmonyMode === "analogous") {
        // Analogous: 5 colors spaced 30° apart
        hues = [
            baseHue,
            (baseHue + 30) % 360,
            (baseHue + 60) % 360,
            (baseHue - 30 + 360) % 360,
            (baseHue - 60 + 360) % 360,
        ];
    } else if (harmonyMode === "complementary") {
        // Complementary: base + its opposite (180°), with variations
        hues = [
            baseHue,
            (baseHue + 30) % 360,
            (baseHue - 30 + 360) % 360,
            (baseHue + 180) % 360,
            (baseHue + 210) % 360,
        ];
    } else if (harmonyMode === "triadic") {
        // Triadic: 3 colors evenly spaced 120° apart, with 2 variations
        hues = [
            baseHue,
            (baseHue + 120) % 360,
            (baseHue + 240) % 360,
            (baseHue + 150) % 360,
            (baseHue + 270) % 360,
        ];
    } else if (harmonyMode === "split-comp") {
        // Split-complementary: base + two colors adjacent to its complement
        hues = [
            baseHue,
            (baseHue + 150) % 360,
            (baseHue + 210) % 360,
            (baseHue + 30) % 360,
            (baseHue - 30 + 360) % 360,
        ];
    }

    // Convert each hue to a hex value and create a new Color instance
    return hues.map((h) => new Color(hslToHex(h, s, l)));
}