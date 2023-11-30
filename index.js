const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 3000;

const adminRoutes = require("./routers/adminRoutes")
const drugPersonalitiesRoutes = require("./routers/drugPersonelRoutes")

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", adminRoutes)
app.use("/api", drugPersonalitiesRoutes)


// Routes
app.get("/", (req, res) => {
  res.send("Hello, this is your Express server!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
