const { MongoClient, BSON } = require("mongodb");
const fs = require("fs-extra");
const path = require("path");

const MONGODB_URI = "mongodb://localhost:27017/";
const DATA_DIR = "./init-data";

// Function to convert Extended JSON strings to MongoDB format
function convertExtendedJSON(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertExtendedJSON(item));
  }

  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object") {
      if (value.$oid) {
        converted[key] = new BSON.ObjectId(value.$oid);
      } else if (value.$date) {
        converted[key] = new Date(value.$date);
      } else {
        converted[key] = convertExtendedJSON(value);
      }
    } else {
      converted[key] = value;
    }
  }
  return converted;
}

async function importData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // Get all JSON files in the init-data directory
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    // Get unique database names from files
    const dbNames = new Set(jsonFiles.map((file) => file.split(".")[0]));

    // Drop each database before importing
    for (const dbName of dbNames) {
      await client.db(dbName).dropDatabase();
      console.log(`Dropped database: ${dbName}`);
    }

    // Process each file
    for (const file of jsonFiles) {
      // Parse the filename to get database and collection names
      const [dbName, collectionName] = file.replace(".json", "").split(".");

      if (!dbName || !collectionName) {
        console.warn(`Skipping ${file}: Invalid filename format`);
        continue;
      }

      // Read the JSON file
      const filePath = path.join(DATA_DIR, file);
      const rawData = await fs.readJson(filePath);

      // Convert Extended JSON format
      const data = convertExtendedJSON(rawData);

      // Get database and collection references
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Insert the data
      if (Array.isArray(data)) {
        if (data.length > 0) {
          await collection.insertMany(data);
          console.log(
            `Imported ${data.length} documents into ${dbName}.${collectionName}`
          );
        } else {
          console.log(`No data to import for ${dbName}.${collectionName}`);
        }
      } else {
        await collection.insertOne(data);
        console.log(`Imported 1 document into ${dbName}.${collectionName}`);
      }
    }

    console.log("Data import completed successfully");
  } catch (error) {
    console.error("Error importing data:", error);
    // Print more detailed error information
    if (error.writeErrors) {
      error.writeErrors.forEach((writeError, index) => {
        console.error(`Write Error ${index + 1}:`, writeError);
      });
    }
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

// Run the import
importData().catch(console.error);
