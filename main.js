// Entry point — connects all modules, handles DOM and events
// 主文件，负责把所有模块串联起来，处理 DOM 和事件

// Import functions from other modules（从其他模块引入函数）
import { generatePalette } from "./colorUtils.js";
import { fetchColorName } from "./api.js";

// Test that all modules are connected correctly（测试模块是否连通）
console.log("main.js loaded");
console.log("palette test:", generatePalette("analogous"));
console.log("api test:", fetchColorName("E88D3E"));