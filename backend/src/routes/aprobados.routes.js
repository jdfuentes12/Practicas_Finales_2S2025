const r = require("express").Router();
const c = require("../controllers/aprobados.controller");

r.get("/usuario/:usuario_id", c.listByUser);
r.post("/", c.add);

module.exports = r;