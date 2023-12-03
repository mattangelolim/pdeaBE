const express = require("express");
const http = require("http"); // Import the HTTP module
const fs = require("fs")
const https = require("https")
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { initializeWebSocket } = require("./socket");

const file = fs.readFileSync("./CF47C1F683821DB722C79C6856A107E9.txt")

const app = express();

app.use("/uploads", express.static("./uploads"))

const port = process.env.PORT || 3000;
const server = http.createServer(app); // Create an HTTP server instance

const adminRoutes = require("./routers/adminRoutes");
const drugPersonalitiesRoutes = require("./routers/drugPersonelRoutes");
const listingRoutes = require("./routers/listingRoutes")
const affiliationRoutes = require ("./routers/affialitionRoutes")

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", adminRoutes);
app.use("/api", drugPersonalitiesRoutes);
app.use("/api", listingRoutes)
app.use("/api", affiliationRoutes)

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

app.get("/.well-known/pki-validation/CF47C1F683821DB722C79C6856A107E9.txt", (req,res) =>{
  res.sendFile('home/ubuntu/pdeaBE/CF47C1F683821DB722C79C6856A107E9.txt')
})

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
