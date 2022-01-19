const express = require("express");
const { getUsers, getTrialUsers } = require("../controllers/adminController");

const checkAuth = require("../middlewares/check-auth");

const routes = express.Router();

routes.get("/users", getUsers);
routes.get("/trial-users", getTrialUsers);

module.exports = routes;
