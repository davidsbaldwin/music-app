const express = require("express");
const {
  getUsers,
  getTrialUsers,
  revokeAccess,
} = require("../controllers/adminController");

const checkAuth = require("../middlewares/check-auth");

const routes = express.Router();

routes.get("/users", getUsers);
routes.get("/trial-users", getTrialUsers);
routes.get("/revoke", revokeAccess);

module.exports = routes;
