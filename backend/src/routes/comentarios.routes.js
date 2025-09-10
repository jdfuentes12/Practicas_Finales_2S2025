const r = require("express").Router();
const c = require("../controllers/comentarios.controller");

r.post("/", c.create);

module.exports = r;