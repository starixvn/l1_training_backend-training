const fs = require("fs-extra");
const path = require("path");

const DATA_DIR = "./init-data";
const TARGET_FILE = "minigame.exchange_rates.json";

// Function to convert currency format
function convertCurrencyFormat(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertCurrencyFormat(item));
  }

  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object") {
      if (value.$numberDecimal) {
        // Convert $numberDecimal string to number
        converted[key] = parseFloat(value.$numberDecimal);
      } else {
        converted[key] = convertCurrencyFormat(value);
      }
    } else {
      converted[key] = value;
    }
  }
  return converted;
}

async function convertExchangeRates() {
  try {
    const filePath = path.join(DATA_DIR, TARGET_FILE);

    // Read the JSON file
    const rawData = await fs.readJson(filePath);

    // Convert currency format
    const convertedData = convertCurrencyFormat(rawData);

    // Write back to file
    await fs.writeJson(filePath, convertedData, { spaces: 2 });
    console.log(`Converted currency format in ${TARGET_FILE}`);

    console.log("Currency format conversion completed successfully");
  } catch (error) {
    console.error("Error converting currency format:", error);
  }
}

// Run the conversion
convertExchangeRates().catch(console.error);
