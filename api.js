// In case the url needs to be changed
const BASE_URL = "https://www.thecolorapi.com";

// Fetches a human-readable name for a given hex value
// Learned from: https://www.thecolorapi.com/docs
export async function fetchColorName(hex) {
    // await to make sure fetch(), response.json() and return data?.name?,value one by one
    const response = await fetch(`${BASE_URL}/id?hex=${hex}`);
    const data = await response.json();

    // Use optional chaining to safely read the name field
    return data?.name?.value ?? "Unknown";
}