const r = require("express").Router();
const c = require("../controllers/cursos.controller");

r.get("/", c.list);
r.post("/", c.create);

module.exports = r;