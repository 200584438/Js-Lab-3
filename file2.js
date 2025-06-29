import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Setup for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Route to send JSON data from data/cars.json
app.get('/cars', async (req, res) => {
  try {
    // Read the JSON file asynchronously
    const dataPath = path.join(__dirname, 'data', 'cars.json');
    const jsonData = await fs.readFile(dataPath, 'utf-8');
    const cars = JSON.parse(jsonData);

    // Send raw JSON data
    res.json(cars);
  } catch (error) {
    res.status(500).send('Error reading cars data');
  }
});

app.listen(port, () => {
  console.log(`File2 running at http://localhost:${port}`);
});
