// Entry point — connects all modules, handles DOM and events
// 主文件，负责把所有模块串联起来，处理 DOM 和事件

// Import functions from other modules（从其他模块引入函数）
import { generatePalette } from "./colorUtils.js";
import { fetchColorName } from "./api.js";

// Get references to DOM elements we need
const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.getElementById("palette-container");
const harmonySelect = document.getElementById("harmony-select");

// Track the currently selected harmony mode (default: analogous)
// 记录当前选中的 harmony 模式，默认是 analogous
let currentMode = "analogous";

// Store the current palette as an array of Color objects
// 用一个变量储存当前的配色，方便锁定和单个 shuffle 时引用
let currentColors = [];

// The harmony mode used to generate the current palette
// 记录生成当前配色时用的 harmony 模式
let lockedMode = "analogous";

// Fetch color names for all unlocked colors in the palette
// 为所有未锁定的颜色获取名称
async function fetchNames(colors) {
    const promises = colors.map(async (color) => {
        if (!color.name) {
            color.name = await fetchColorName(color.hex);
        }
    });
    // Wait for all fetch requests to complete before rendering
    // 等所有请求完成再渲染，避免名称还没回来就显示
    await Promise.all(promises);
}

// Render the palette to the DOM
// 把五个 Color 对象渲染成色卡，显示在页面上
function renderPalette(colors) {
    // Clear the container before rendering new cards
    // 渲染新色卡之前先清空容器
    paletteContainer.innerHTML = "";

    colors.forEach((color, index) => {
        // Create the card element
        const card = document.createElement("div");
        card.classList.add("color-card");

        // Set the card's background to the color's hex value
        // 用颜色的 hex 值设置色块背景
        card.innerHTML = `
      <div class="color-swatch" style="background: #${color.hex};">
        <span class="lock-icon">${color.locked ? "🔒" : "🔓"}</span>
      </div>
      <div class="card-body">
        <p class="hex-val">#${color.hex}</p>
        <p class="color-name">${color.name || "Loading..."}</p>
        <div class="card-actions">
          <button class="lock-btn" data-index="${index}">Lock</button>
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
    // 渲染完成后再绑定事件，因为按钮是动态生成的
    attachCardListeners();
}

// Generate and render a new palette
// 生成新配色并渲染到页面
async function generate() {
    // Save the mode used for this generation, so Shuffle can reference it later
    lockedMode = currentMode;

    // Keep locked colors, replace unlocked ones
    // 保留锁定的颜色，只替换未锁定的
    const newColors = generatePalette(currentMode);

    currentColors = currentColors.length === 0
        ? newColors
        : currentColors.map((color, i) => (color.locked ? color : newColors[i]));

    await fetchNames(currentColors);
    renderPalette(currentColors);
}

// Attach event listeners to dynamically generated card buttons
// 为动态生成的按钮绑定事件
function attachCardListeners() {

    // Lock / Unlock buttons
    document.querySelectorAll(".lock-btn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            const index = event.target.dataset.index;
            currentColors[index].locked = !currentColors[index].locked;
            renderPalette(currentColors);
        });
    });

    // Shuffle buttons — regenerate only this one card
    // 只重新生成这一张色卡
    document.querySelectorAll(".shuffle-btn").forEach((btn) => {
        btn.addEventListener("click", async (event) => {
            const index = event.target.dataset.index;

            // Don't shuffle if the color is locked
            // 如果这张色卡被锁定，不执行 shuffle
            if (currentColors[index].locked) return;

            // Generate a new color based on the original harmony mode
            // Keep trying until we get a color that doesn't already exist in the palette
            let newColor;
            const existingHexes = currentColors.map((c) => c.hex);

            do {
                [newColor] = generatePalette(lockedMode);
            } while (existingHexes.includes(newColor.hex)); newColor.name = await fetchColorName(newColor.hex);
            
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
            // 用 try/catch 验证用户输入的 hex 格式
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
// 用 Event object 读取用户点击的是哪个 harmony 按钮
// Update current mode when user changes the dropdown
harmonySelect.addEventListener("change", (event) => {
    currentMode = event.target.value;
});

// Generate a new palette when the button is clicked
generateBtn.addEventListener("click", generate);

// Generate an initial palette on page load
// 页面加载时自动生成一次配色
generate();