const express = require("express");
const {
  signUp,
  signIn,
  getAlbums,
  getSongs,
  addHistory,
  getHistory,
  getExpiringDays,
} = require("../controllers/userController");
const checkAuth = require("../middlewares/check-auth");

const routes = express.Router();

routes.post("/signup", signUp);
routes.post("/signin", signIn);
// routes.get("/expiring-days", checkAuth, getExpiringDays);
routes.get("/albums", getAlbums);
routes.get("/history/:user_email", getHistory);
routes.get("/songs/:album_name", getSongs);
routes.post("/history/add", addHistory);

module.exports = routes;
