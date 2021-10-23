const express = require("express");
const user = require("./routes/userRoutes");
const path = require("path");
const cors = require("cors");
const connectDB = require("./db");
const morgan = require("morgan");
const AWS = require("aws-sdk");

// app config
const PORT = process.env.PORT || 5000;
const app = express();

// DB Config
connectDB();

const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_REGION;

// AWS config
let s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region,
});

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// set static folder
// it is a choice that you wanna use __dirname or not because you are on root level.
app.use(express.static(path.join(__dirname, "public")));
// app.use("/images", express.static("https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/images"));
// app.use("/audio", express.static("https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/audio"));
// app.use("/audio", express.static(path.join(__dirname, "uploads", "audio")));
// app.use("/audio", express.static(path.join(__dirname, "uploads", "files")));

// routes
app.use("/api", user);

// To get S3 files
app.get("/files", (req, res) => {
    let bucketParams = {
        Bucket: bucketName,
    };

    s3.listObjects(bucketParams, function (err, data) {
        if (err) return res.status(200).send(err);
        else {
            console.log("Error");
            res.status(200).send(data);
        }
    });
});

// To get S3 file
app.get("/files/:Key", (req, res) => {
    const { Key } = req.params;

    let bucketParams = {
        Bucket: bucketName,
        Key: "uploads/audio/" + Key,
    };

    s3.getObject(bucketParams, function (err, data) {
        if (err) return res.status(200).send(err);
        else {
            console.log("Error");
            res.status(200).send(data);
        }
    });
});

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
