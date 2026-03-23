// Entry point — connects all modules, handles DOM and events
// 主文件，负责把所有模块串联起来，处理 DOM 和事件

// Import functions from other modules（从其他模块引入函数）
import { generatePalette } from "./colorUtils.js";
import { fetchColorName } from "./api.js";

// Get references to DOM elements we need
// 获取需要操作的 DOM 元素
const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.getElementById("palette-container");
const harmonyBtns = document.querySelectorAll(".harmony-btn");

// Track the currently selected harmony mode (default: analogous)
// 记录当前选中的 harmony 模式，默认是 analogous
let currentMode = "analogous";

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
}

// Generate and render a new palette
// 生成新配色并渲染到页面
function generate() {
    const colors = generatePalette(currentMode);
    renderPalette(colors);
}

// Handle harmony mode selection using the Event object
// 用 Event object 读取用户点击的是哪个 harmony 按钮
harmonyBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        // Remove active class from all buttons
        harmonyBtns.forEach((b) => b.classList.remove("active"));

        // Add active class to the clicked button
        event.target.classList.add("active");

        // Update current mode using the data-mode attribute
        // 用 data attribute 读取选中的模式
        currentMode = event.target.dataset.mode;
    });
});

// Generate a new palette when the button is clicked
generateBtn.addEventListener("click", generate);

// Generate an initial palette on page load
// 页面加载时自动生成一次配色
generate();