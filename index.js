const express = require("express");
const http = require("http"); // Import the HTTP module
const fs = require("fs");
const https = require("https");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { initializeWebSocket } = require("./socket");

const file = fs.readFileSync("./DD47ED7C84A839388A589948EA5A10C4.txt")
// const key = fs.readFileSync("private.key");
// const cert = fs.readFileSync("certificate.crt");

// const cred = {
//   key,
//   cert,
// };

const app = express();

app.use("/uploads", express.static("./uploads"));

const port = process.env.PORT || 3000;
const httpServer = http.createServer(app);
// const httpsServer = https.createServer(cred, app); // Create an HTTP server instance

const adminRoutes = require("./routers/adminRoutes");
const drugPersonalitiesRoutes = require("./routers/drugPersonelRoutes");
const listingRoutes = require("./routers/listingRoutes");
const affiliationRoutes = require("./routers/affialitionRoutes");
const vehicleRecordRoutes = require("./routers/vehicleRecordRoutes");
const illegalDrugsRoutes = require("./routers/illegalDrugsRoutes");
const bankDetailsRoutes = require("./routers/bankDetailsRoutes");
const otherRemarksRoutes = require("./routers/otherRemarksRoutes");
const progressRoutes = require("./routers/progressRoutes");
const dashboardRoutes = require("./routers/dashBoardRoutes");
const familyRoutes = require("./routers/familyRoutes")

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", adminRoutes);
app.use("/api", drugPersonalitiesRoutes);
app.use("/api", listingRoutes);
app.use("/api", affiliationRoutes);
app.use("/api", vehicleRecordRoutes);
app.use("/api", illegalDrugsRoutes);
app.use("/api", bankDetailsRoutes);
app.use("/api", otherRemarksRoutes);
app.use("/api", progressRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", familyRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Hello, this is your Express server!");
});

app.get('/.well-known/pki-validation/DD47ED7C84A839388A589948EA5A10C4.txt', (req, res) => {
  res.sendFile('/home/ubuntu/pdeaBE/DD47ED7C84A839388A589948EA5A10C4.txt')
})

// Pass the server instance to initializeWebSocket function
// initializeWebSocket(httpsServer);

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// Start the server
httpServer.listen(port, () => {
  console.log(`HTTP server is running on http://localhost:${port}`);
});

// httpsServer.listen(process.env.HTTPSPORT, () => {
//   console.log(`HTTPS server is running on ${process.env.HTTPSPORT}`);
// });
