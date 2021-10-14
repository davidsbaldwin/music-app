const { singUpValidation, singInValidation } = require("../validation/adminValidation");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Albums = require("../models/Album");
const Songs = require("../models/Songs");

exports.signUp = async (req, res) => {
    const { password, email } = await req.body;
    const { error } = singUpValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const exist = await User.findOne({ email });
    if (exist) return res.status(422).send("User Already Exist");

    const hashedPass = await bcrypt.hash(password, 10);
    const user = { ...req.body, password: hashedPass };

    User.create(user, (err, data) => {
        if (err) return res.status(500).send(err);
        res.status(201).send(data);
    });
};

exports.signIn = async (req, res) => {
    const { password, email } = await req.body;

    const { error } = singInValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const exist = await User.findOne({ email });
    if (!exist) return res.status(401).send("Invalid Credentials");

    const validPass = await bcrypt.compare(password, exist.password);
    if (!validPass) return res.status(401).send("Invalid Credentials");

    const token = jwt.sign({ id: exist._id }, process.env.JWT_SECRET_KEY);
    const user = { name: exist?.name, email, token };

    res.status(200).send(user);
};

exports.getAlbums = async (req, res) => {
    try {
        const albums = await Albums.find();
        return res.status(200).send(albums);
    } catch (err) {
        return res.status(500).send({ msg: "Not Found!", err });
    }
};

exports.getSongs = async (req, res) => {
    const { album_id } = req.params;
    // const domainHost = `${req.protocol}://${req.get("host")}/`;
    try {
        const songs = await Songs.find({ Album_id: album_id });
        return res.status(200).send(songs);
    } catch (err) {
        return res.status(500).send({ msg: "Not Found!", err });
    }
};
