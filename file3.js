import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON body

const dataPath = path.join(__dirname, 'data', 'cars.json');

// Helper function to read cars data
async function readCars() {
  const data = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(data);
}

// Helper function to write cars data
async function writeCars(cars) {
  await fs.writeFile(dataPath, JSON.stringify(cars, null, 2), 'utf-8');
}

// CREATE - Add a new car (POST)
app.post('/cars', async (req, res) => {
  try {
    const cars = await readCars();
    const newCar = req.body;

    // Basic validation
    if (!newCar.id || !newCar.brand || !newCar.model) {
      return res.status(400).json({ error: 'id, brand and model are required' });
    }

    // Check if ID already exists
    if (cars.find(car => car.id === newCar.id)) {
      return res.status(400).json({ error: 'Car with this id already exists' });
    }

    cars.push(newCar);
    await writeCars(cars);
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add car' });
  }
});

// READ - Get all cars (GET)
app.get('/cars', async (req, res) => {
  try {
    const cars = await readCars();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read cars' });
  }
});

// UPDATE - Update a car by id (PUT)
app.put('/cars/:id', async (req, res) => {
  try {
    const cars = await readCars();
    const id = parseInt(req.params.id);
    const index = cars.findIndex(car => car.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const updatedCar = { ...cars[index], ...req.body, id };
    cars[index] = updatedCar;
    await writeCars(cars);
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update car' });
  }
});

// DELETE - Remove a car by id (DELETE)
app.delete('/cars/:id', async (req, res) => {
  try {
    const cars = await readCars();
    const id = parseInt(req.params.id);
    const filteredCars = cars.filter(car => car.id !== id);

    if (filteredCars.length === cars.length) {
      return res.status(404).json({ error: 'Car not found' });
    }

    await writeCars(filteredCars);
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

app.listen(port, () => {
  console.log(`File3 running at http://localhost:${port}`);
});
