const r = require("express").Router();
const c = require("../controllers/publicaciones.controller");

r.get("/", c.list);
r.get("/:id", c.detail);
r.post("/", c.create);

module.exports = r;