const express = require("express");
const user = require("./routes/userRoutes");
const path = require("path");
const cors = require("cors");
const connectDB = require("./db");
const morgan = require("morgan");
const AWS = require("aws-sdk");
var cron = require("node-cron");
const User = require("./models/User");
const moment = require("moment");
const {
  checkUserAvailability,
  getUsers,
} = require("./controllers/userController");

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
// app.use("/audio", express.static(path.join(__dirname, "uploads", "audio")));
// app.use("/audio", express.static(path.join(__dirname, "uploads", "files")));
// app.use("/image", express.static("https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/images/Ecossaise1-eng.jpg"));
// app.use("/audio", express.static("https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads"));

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
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// check user trial period
cron.schedule("0 */1 * * *", async () => {
  console.log("running a task every minute");
  const users = await User.find({ trial: true });
  let expired = [];
  await users.map((user) => {
    let fomatted_date = moment(user.createdAt).format("YYYY-MM-DD");

    let current_date = moment().format("YYYY-MM-DD");
    let diff = Math.abs(
      current_date.split("-")[2] - fomatted_date.split("-")[2]
    );
    if (diff > 3) {
      expired.push(user);
    }
  });

  expired?.map((expUser) => {
    User.findByIdAndUpdate(
      expUser._id,
      { trial: false },
      { useFindAndModify: false }
    ).then((user) => {
      console.log("trial period expired", user.email);
    });
  });
});

// listening
app.listen(PORT, () => console.log(`It is listening on port ${PORT}`));

// send mail

// setInterval(async () => {
//   let users = [];
//   getUsers().then((data) => {
//     users = data;
//   });
//   let i;
//   for (i = 0; i < users.length; i++) {
//     checkUserAvailability(users[i]).then((data) => {
//       if (!data) {
//         return 0;
//       }
//       let userDate = new Date(parseInt(data.createdAt));
//       let currentDate = new Date();
//       let offset = new Date();
//       offset = new Date(offset.setMonth(currentDate.getMonth() - 1));
//       let flag = false;
//       if (offset > userDate) {
//         flag = true;
//       }
//       if (flag) {
//         // email
//         console.log("mailing....");
//         var data = {
//           service_id: "service_8c0duye",
//           template_id: "template_msow9ve",
//           user_id: "user_6pLDnHDlzTFb4qYFwntcp",
//           template_params: {
//             from_name: "RehanDev",
//             to_name: "hiugheurighiue",
//             user_email: "muhammadrehanrasool@gmail.com",
//             message: "bla",
//           },
//         };
//         axios
//           .post("https://api.emailjs.com/api/v1.0/email/send", data)
//           .then(function () {
//             console.log("Your mail is sent!");
//           })
//           .catch(function (error) {
//             console.log("Oops... " + JSON.stringify(error));
//           });
//       }
//     });
//   }
// }, 24 * 60 * 60 * 1000);
