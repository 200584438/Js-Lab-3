// Import express using ES module syntax
import express from 'express';

// Create an express app
const app = express();
const port = 3000;

// Define the home route to display group members
app.get('/', (req, res) => {
  res.send(`
    <h1>Group Members:</h1>
    <p>1. Karina Nepal<br>
       2. Bhawana Khadka<br>
       3. Sarishma Giri</p>
  `);
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
