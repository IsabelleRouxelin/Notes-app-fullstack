// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const { message } = require("statuses");
const { v4: uuidv4 } = require("uuid"); // creates a unique identifier for our record in our database

// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
const PORT = 3001;

// Middleware to parse incoming JSON requests- This is middleware that parses incoming requests with JSON payloads
app.use(express.json());
//When clients send JSON data in POST/PUT requests, this middleware automatically parses it into a JavaScript object available at req.body

// Define the path to the JSON file
const dataFilePath = path.join(__dirname, "data.json");
// path.join ensures the path works correctly across different operating systems
//__dirname gives us the directory of the current script

// Function to read data from the JSON file
const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);// takes it from being string version of json to an object in memory
};

// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));// null, 2 makes JSON file readable with proper formatting - has 2-space indentation
};

// Handle GET request at the root route
app.get("/", (req, res) => {
  res.send("Welcome to the simple Express app!");// good for testing the server is running 
});

// Handle GET request to retrieve stored data
app.get("/data", (req, res) => {
  const data = readData();
  res.json(data);
});

// Handle POST request to save new data with a unique ID
app.post("/data", (req, res) => {
  const newData = { id: uuidv4(), ...req.body };// ... is a spread 
  const currentData = readData();
  currentData.push(newData);
  writeData(currentData);
  res.json({ message: "Data saved successfully", data: newData });
});

// Handle GET request to retrieve data by ID
app.get("/data/:id", (req, res) => {
  const data = readData();
  const item = data.find((item) => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Data not found" });
  }
  res.json(item);
});

// TODO: Handle PUT request to update data by ID
app.put("/data/:id", (req, res) => {
    const data = readData();
    const index = data.findIndex((item) => item.id === req.params.id);
  
    if (index === -1) {
      return res.status(404).json({ message: "Note not found" });
    }
  
    data[index] = { ...data[index], ...req.body }; 
    writeData(data);
    res.json({ message: "Note updated successfully", data: data[index] });
  });

// TODO: Handle DELETE request to delete data by ID
app.delete("/data/:id", (req, res) => {
    const data = readData();
    const index = data.findIndex((item) => item.id === req.params.id);
  
    if (index === -1) {
      return res.status(404).json({ message: "Note not found" });
    }
  
//remove the item from the array
    const [deletedItem] = data.splice(index, 1);
    writeData(data);
    res.json({ message: "Note deleted successfully", data: deletedItem});
});

// Handle POST request at the /echo route
app.post("/echo", (req, res) => {
  // Respond with the same data that was received in the request body
  res.json({ received: req.body });
});

// Wildcard route to handle undefined routes
app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
