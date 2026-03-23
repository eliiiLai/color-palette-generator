// Entry point — connects all modules, handles DOM and events
// 主文件，负责把所有模块串联起来，处理 DOM 和事件

// Import functions from other modules（从其他模块引入函数）
import { generatePalette } from "./colorUtils.js";
import { fetchColorName } from "./api.js";

// Test color generation with all four harmony modes
// 测试四种 harmony 模式是否都能正常生成颜色
console.log("main.js loaded");
console.log("analogous:", generatePalette("analogous"));
console.log("complementary:", generatePalette("complementary"));
console.log("triadic:", generatePalette("triadic"));
console.log("split-comp:", generatePalette("split-comp"));