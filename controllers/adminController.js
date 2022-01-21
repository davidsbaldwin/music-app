const User = require("../models/User");

const codes = require("../data/codes");
const moment = require("moment");

exports.getUsers = async (req, res) => {
  try {
    let page = req?.query?.page ? +req?.query?.page : 1;
    let perPage = req?.query?.perPage ? +req?.query?.perPage : 10;

    const options = {
      select: "email createdAt code _id",
      sort: { _id: -1 },
      lean: true,
      page: page,
      limit: perPage,
    };
    const user = await User.paginate({}, options);
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ msg: "server error!", err });
  }
};

exports.getTrialUsers = async (req, res) => {
  try {
    let page = req?.query?.page ? +req?.query?.page : 1;
    let perPage = req?.query?.perPage ? +req?.query?.perPage : 10;

    const options = {
      select: "email createdAt trial code _id",
      sort: { _id: -1 },
      lean: true,
      page: page,
      limit: perPage,
    };
    const user = await User.paginate({ code: process.env.trialKey }, options);
    console.log(user);
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ msg: "server error!", err });
  }
};

exports.revokeAccess = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findByIdAndUpdate(
      id,
      { trial: false },
      { new: true },
      { useFindAndModify: false }
    );

    return res.status(200).json({
      user,
      message: "User Revoke Success!",
    });
  } catch (err) {
    return res.status(500).send({ msg: "server error!", err });
  }
};
