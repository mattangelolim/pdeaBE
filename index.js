const express = require("express");
const http = require("http"); // Import the HTTP module
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { initializeWebSocket } = require("./socket");

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app); // Create an HTTP server instance

const adminRoutes = require("./routers/adminRoutes");
const drugPersonalitiesRoutes = require("./routers/drugPersonelRoutes");
const listingRoutes = require("./routers/listingRoutes")

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", adminRoutes);
app.use("/api", drugPersonalitiesRoutes);
app.use("/api", listingRoutes)

// Routes
app.get("/", (req, res) => {
  res.send("Hello, this is your Express server!");
});

// Pass the server instance to initializeWebSocket function
initializeWebSocket(server);

app.use((req, res, next) => {
  req.io = io; // Assuming io is a global variable in your application
  next();
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
