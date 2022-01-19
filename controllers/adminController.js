const User = require("../models/User");

const codes = require("../data/codes");
const moment = require("moment");

exports.getUsers = async (req, res) => {
  try {
    let page = req?.query?.page ? +req?.query?.page : 1;
    let perPage = req?.query?.perPage ? +req?.query?.perPage : 10;

    const options = {
      select: "email createdAt",
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
  console.log("hi");
  try {
    const user = await User.find({ trial: true })
      .select("email name createdAt")
      .sort({ _id: -1 });
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ msg: "server error!", err });
  }
};
