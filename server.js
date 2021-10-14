const express = require("express");
const user = require("./routes/userRoutes");
const path = require("path");
const cors = require("cors");
const connectDB = require("./db");
const morgan = require("morgan");

// app config
const PORT = process.env.PORT || 5000;
const app = express();

// DB Config
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// set static folder
// it is a choice that you wanna use __dirname or not because you are on root level.
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "uploads", "images")));
app.use("/files", express.static(path.join(__dirname, "uploads", "files")));

// routes
app.use("/api", user);

// wrong route
app.use((req, res) => {
    res.send({ msg: "Server Started" });
});

// CORS middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization",
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

// listening
app.listen(PORT, () => console.log(`It is listening on port ${PORT}`));
