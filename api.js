// Handles all communication with The Color API 负责与 TheColorAPI的通信

const BASE_URL = "https://www.thecolorapi.com";

// Fetches a human-readable name for a given hex value
// 通过 hex 值从 The Color API 获取颜色名称
export async function fetchColorName(hex) {
  const response = await fetch(`${BASE_URL}/id?hex=${hex}`);
  const data = await response.json();

  // Use optional chaining to safely read the name field
  // 用 optional chaining 安全读取名称，防止字段缺失时报错
  return data?.name?.value ?? "Unknown";
}