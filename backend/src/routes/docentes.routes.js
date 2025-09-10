const r = require("express").Router();
const c = require("../controllers/docentes.controller");

r.get("/", c.list);
r.post("/", c.create);
r.post("/vincular", c.linkCurso);

module.exports = r;