const express = require("express");
const user = require("./routes/userRoutes");
const path = require("path");
const cors = require("cors");
const connectDB = require("./db");
const morgan = require("morgan");
// const AWS = require("aws-sdk");

// app config
const PORT = process.env.PORT || 5000;
const app = express();

// DB Config
connectDB();

// const bucketName = process.env.AWS_BUCKET_NAME;
// const accessKeyId = process.env.AWS_ACCESS_KEY;
// const secretAccessKey = process.env.AWS_SECRET_KEY;
// const region = process.env.AWS_REGION;

// // AWS config
// let s3 = new AWS.S3({
//     accessKeyId,
//     secretAccessKey,
//     region,
// });

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// set static folder
// it is a choice that you wanna use __dirname or not because you are on root level.
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "uploads", "images")));
app.use("/audio", express.static(path.join(__dirname, "uploads", "files")));
// app.use("/audio", express.static(path.join(__dirname, "uploads", "files")));

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
