const express = require("express");
const { signUp, signIn, getAlbums, getSongs } = require("../controllers/userController");
// const checkAuth = require("../middlewares/check-auth");

const routes = express.Router();

routes.post("/signup", signUp);
routes.post("/signin", signIn);
routes.get("/albums", getAlbums);
routes.get("/songs/:album_name", getSongs);

module.exports = routes;
