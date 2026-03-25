// Entry point — connects all modules, handles DOM and events

// Import functions from other modules
import { generatePalette } from "./colorUtils.js";
import { fetchColorName } from "./api.js";

// Get references to DOM elements we need
const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.getElementById("palette-container");
const harmonySelect = document.getElementById("harmony-select");

// Track the currently selected harmony mode (default: analogous)
let currentMode = "analogous";

// Store the current palette as an array of Color objects
let currentColors = [];

// The harmony mode used to generate the current palette
let lockedMode = "analogous";

// Fetch color names for all unlocked colors in the palette
async function fetchNames(colors) {
    const promises = colors.map(async (color) => {
        if (!color.name) {
            color.name = await fetchColorName(color.hex);
        }
    });
    // Wait for all fetch requests to complete before rendering
    await Promise.all(promises);
}

// Render the palette to the DOM
function renderPalette(colors) {
    // Clear the container before rendering new cards
    paletteContainer.innerHTML = "";

    colors.forEach((color, index) => {
        // Create the card element
        const card = document.createElement("div");
        card.classList.add("color-card");

        // Set the card's background to the color's hex value
        card.innerHTML = `
      <div class="color-swatch" style="background: #${color.hex};">
        <span class="lock-icon">${color.locked ? "🔒" : "🔓"}</span>
      </div>
      <div class="card-body">
        <p class="hex-val">#${color.hex}</p>
        <p class="color-name">${color.name || "Loading..."}</p>
        <div class="card-actions">
        <button class="lock-btn" data-index="${index}">${color.locked ? "Unlock" : "Lock"}</button>
          <button class="shuffle-btn" data-index="${index}">Shuffle</button>
          <button class="copy-btn" data-index="${index}">Copy</button>
        </div>
        <div class="hex-input-row">
          <input class="hex-input" type="text" value="#${color.hex}" data-index="${index}" />
          <button class="apply-btn" data-index="${index}">Apply</button>
        </div>
      </div>
    `;

        paletteContainer.appendChild(card);
    });

    // Attach event listeners to all buttons after rendering
    attachCardListeners();
}

// Generate and render a new palette
async function generate() {
    // Save the mode used for this generation, so Shuffle can reference it later
    lockedMode = currentMode;

    // Keep locked colors, replace unlocked ones
    const newColors = generatePalette(currentMode);

    // Conditional operator syntax: condition ? exprIfTrue : exprIfFalse
    currentColors = currentColors.length === 0
        ? newColors
        : currentColors.map((color, i) => (color.locked ? color : newColors[i]));

    await fetchNames(currentColors);
    renderPalette(currentColors);
}

// Attach event listeners to dynamically generated card buttons
function attachCardListeners() {

    // Lock / Unlock buttons
    document.querySelectorAll(".lock-btn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            const index = event.target.dataset.index;
            currentColors[index].locked = !currentColors[index].locked;
            renderPalette(currentColors);
        });
    });

    // Shuffle buttons clicked -> regenerate only this one card
    document.querySelectorAll(".shuffle-btn").forEach((btn) => {
        btn.addEventListener("click", async (event) => {
            const index = event.target.dataset.index;

            // Don't shuffle if the color is locked
            if (currentColors[index].locked) {
                return;
            }
            
            // Generate a new color based on the original harmony mode
            // Keep trying until we get a color that doesn't already exist in the palette
            let newColor;
            const existingHexes = currentColors.map((c) => c.hex);

            do {
                [newColor] = generatePalette(lockedMode);
            } while (existingHexes.includes(newColor.hex));

            newColor.name = await fetchColorName(newColor.hex);

            currentColors[index] = newColor;
            renderPalette(currentColors);
        });
    });

    // Copy buttons — write hex value to clipboard
    document.querySelectorAll(".copy-btn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            const index = event.target.dataset.index;
            navigator.clipboard.writeText(`#${currentColors[index].hex}`);
        });
    });

    // Apply buttons — update color from hex input field
    document.querySelectorAll(".apply-btn").forEach((btn) => {
        btn.addEventListener("click", async (event) => {
            const index = event.target.dataset.index;
            const input = document.querySelector(`.hex-input[data-index="${index}"]`);

            // Use try/catch to validate the hex input
            try {
                const raw = input.value.replace("#", "").toUpperCase();

                // Check that the value is a valid 6-character hex string
                if (!/^[0-9A-F]{6}$/.test(raw)) {
                    throw new Error("Invalid hex value");
                }

                currentColors[index].hex = raw;
                currentColors[index].name = await fetchColorName(raw);
                renderPalette(currentColors);

            } catch (error) {
                alert(`"${input.value}" is not a valid hex color. Please enter a 6-digit hex value, e.g. #E88D3E`);
            }
        });
    });
}

// Handle harmony mode selection using the Event object
// Update current mode when user changes the dropdown
harmonySelect.addEventListener("change", (event) => {
    currentMode = event.target.value;
});

// Generate a new palette when the button is clicked
generateBtn.addEventListener("click", generate);

// Generate an initial palette on page load
generate();