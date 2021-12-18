const {
  singUpValidation,
  singInValidation,
} = require("../validation/adminValidation");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Albums = require("../models/Album");
const Songs = require("../models/Songs");
const History = require("../models/History");
const codes = require("../data/codes");
const moment = require("moment");
exports.signUp = async (req, res) => {
  const { password, email, code } = await req.body;
  console.log(req.body);
  console.log(code);
  let trial = false;
  let user;
  if (code === process.env.trialKey) {
    const exist = await User.findOne({ email });
    if (exist) return res.status(422).send("User Already Exist");
    const hashedPass = await bcrypt.hash(password, 10);
    trial = true;
    user = { ...req.body, trial: true, password: hashedPass };
  } else if (!codes.includes(code)) {
    return res.status(400).send("Invalid Code: " + code);
  } else if (code.includes(code)) {
    const codeExists = await User.findOne({ $or: [{ email }, { code }] });
    if (codeExists)
      return res.status(400).send("Sorry, you are not the owner.");
    const hashedPass = await bcrypt.hash(password, 10);
    user = { ...req.body, password: hashedPass };
  }

  const { error } = singUpValidation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  User.create(user, (err, data) => {
    if (err) return res.status(500).send(err);
    const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET_KEY);
    if (trial) {
      res.status(201).send({ email, token, expiresIn: 3 });
    } else {
      res.status(201).send({ email, token });
    }
  });
};

exports.signIn = async (req, res) => {
  const { password, email, code } = await req.body;

  if (code) {
    if (!codes.includes(code))
      return res.status(401).send("Sorry, you are not the owner.");

    const { error } = singUpValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const exist = await User.findOne({ email: email }, { code: code });
    if (exist) {
      // console.log("Exists");
      const hashedPass = await bcrypt.hash(password, 10);
      const update = await User.findOneAndUpdate(
        { email: email, code: code },
        { password: hashedPass }
      );
      if (update) return res.status(200).send("Password Changed!");
    } else {
      return res.status(422).send("Sorry, you are not the owner.");
    }
  } else {
    delete req.body.code;
    const { error } = singInValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const exist = await User.findOne({ email });
    if (exist) {
      if (exist.code === process.env.trialKey) {
        if (!exist.trial) {
          return res.status(401).send("Your Trial Period has expired!");
        } else {
          const validPass = await bcrypt.compare(password, exist.password);
          if (!validPass) return res.status(401).send("Incorrect Password");

          const token = jwt.sign({ id: exist._id }, process.env.JWT_SECRET_KEY);
          let createdAt = moment(exist.createdAt).format("YYYY-MM-DD");
          let current_date = moment().format("YYYY-MM-DD");
          let diff = Math.abs(
            createdAt.split("-")[2] - current_date.split("-")[2]
          );
          let expiresIn = 3 - diff;
          const user = { email, token, expiresIn };

          return res.status(200).send(user);
        }
      } else if (codes.includes(exist.code)) {
        const validPass = await bcrypt.compare(password, exist.password);
        if (!validPass) return res.status(401).send("Incorrect Password");

        const token = jwt.sign({ id: exist._id }, process.env.JWT_SECRET_KEY);

        const user = { email, token };

        return res.status(200).send(user);
      } else {
        res.status(422).send("Sorry, you are not the owner.");
      }
    } else {
      return res.status(401).send("User Not Found");
    }
  }
};

exports.getExpiringDays = async (req, res) => {
  console.log("83", req.userId);

  try {
    // const user = await User.findById(req.userId);
    User.findById(req.userId).then((user) => {
      let fomatted_date = moment(user?.createdAt).format("YYYY-MM-DD");
      let currentDate = moment().startOf("day");
      let start = moment(fomatted_date, "YYYY-MM-DD");
      let end = moment(currentDate, "YYYY-MM-DD");
      let diff = Math.abs(moment.duration(start.diff(end)).asDays());
      //   console.log("diff", diff);
      //     if(diff === 0){

      //     }
      res.status(200).json({ days: diff });
    });
    // return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ msg: "Not Found!", err });
  }
};
exports.getAlbums = async (req, res) => {
  try {
    const albums = await Albums.find().sort({ _id: -1 });
    return res.status(200).send(albums);
  } catch (err) {
    return res.status(500).send({ msg: "Not Found!", err });
  }
};

exports.getSongs = async (req, res) => {
  const { album_name } = req.params;
  // const domainHost = `${req.protocol}://${req.get("host")}/`;
  try {
    const songs = await Songs.find({ Album_Name: album_name });
    if (songs.length > 0) {
      const album = await Albums.findOne({ _id: songs[0].Album_id });
      return res.status(200).send([songs, album]);
    }
    return res.status(200).send([songs]);
  } catch (err) {
    return res.status(500).send({ msg: "Not Found!", err });
  }
};

exports.addHistory = async (req, res) => {
  const { songName, albumName, userEmail, createdAt } = await req.body;
  if (songName && albumName && userEmail && createdAt) {
    const history = { songName, albumName, userEmail, createdAt };
    History.create(history, (err, data) => {
      if (err) return res.status(401).send(err);
      res.status(201).send({ data });
    });
  }
  // const { album_name } = req.params;
  // const domainHost = `${req.protocol}://${req.get("host")}/`;
  // try {
  //     const songs = await Songs.find({ Album_Name: album_name });
  //     if (songs.length > 0) {
  //         const album = await Albums.findOne({ _id: songs[0].Album_id });
  //         return res.status(200).send([songs, album]);
  //     }
  //     return res.status(200).send([songs]);
  // } catch (err) {
  //     return res.status(500).send({ msg: "Not Found!", err });
  // }
};

exports.getHistory = async (req, res) => {
  const { user_email } = req.params;
  // const domainHost = `${req.protocol}://${req.get("host")}/`;
  try {
    const history = await History.find({ userEmail: user_email })
      .sort({ _id: -1 })
      .limit(20);
    // if (history.length > 0) {
    //     const album = await Albums.findOne({ _id: songs[0].Album_id });
    //     return res.status(200).send([songs, album]);
    // }
    return res.status(200).send([history]);
  } catch (err) {
    return res.status(500).send({ msg: "Not Found!", err });
  }
};

exports.checkUserAvailability = async (userMail) => {
  try {
    return await History.findOne({ userEmail: userMail }).sort({ _id: -1 });
  } catch (err) {
    return null;
  }
};

exports.getUsers = async () => {
  try {
    return await History.find({}).distinct("userEmail");
  } catch (err) {
    return null;
  }
};
