const { singUpValidation, singInValidation } = require("../validation/adminValidation");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Albums = require("../models/Album");
const Songs = require("../models/Songs");
const History = require("../models/History");
const codes = require("../data/codes");

exports.signUp = async (req, res) => {
    const { password, email, code } = await req.body;
    console.log(req.body);
    if (!codes.includes(code)) return res.status(400).send("Invalid Code: " + code);

    const { error } = singUpValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const exist = await User.findOne({ $or: [{ email }, { code }] });
    if (exist) return res.status(422).send("User Already Exist");

    const hashedPass = await bcrypt.hash(password, 10);
    const user = { ...req.body, password: hashedPass };

    User.create(user, (err, data) => {
        if (err) return res.status(500).send(err);
        const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET_KEY);
        res.status(201).send({ email, token });
    });
};

exports.signIn = async (req, res) => {
    const { password, email, code } = await req.body;
    if (code) {
        if (!codes.includes(code)) return res.status(401).send("Sorry, you are not the owner.");

        const { error } = singUpValidation.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const exist = await User.findOne({ email: email }, { code: code });
        if (exist) {
            // console.log("Exists");
            const hashedPass = await bcrypt.hash(password, 10);
            const update = await User.findOneAndUpdate({ email: email, code: code }, { password: hashedPass });
            if (update) return res.status(200).send("Password Changed!");
        }
        return res.status(422).send("Sorry, you are not the owner.");
    } else {
        delete req.body.code;
        const { error } = singInValidation.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const exist = await User.findOne({ email });
        if (!exist) return res.status(401).send("Invalid Credentials");

        const validPass = await bcrypt.compare(password, exist.password);
        if (!validPass) return res.status(401).send("Invalid Credentials");

        const token = jwt.sign({ id: exist._id }, process.env.JWT_SECRET_KEY);
        const user = { email, token };

        res.status(200).send(user);
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
    const { songName, albumName, userEmail } = await req.body;
    if (songName && albumName && userEmail) {
        const history = { songName, albumName, userEmail };
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
        const history = await History.find({ userEmail: user_email }).sort({ _id: -1 }).limit(20);
        // if (history.length > 0) {
        //     const album = await Albums.findOne({ _id: songs[0].Album_id });
        //     return res.status(200).send([songs, album]);
        // }
        return res.status(200).send([history]);
    } catch (err) {
        return res.status(500).send({ msg: "Not Found!", err });
    }
};
