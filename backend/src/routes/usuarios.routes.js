const r = require("express").Router();
const c = require("../controllers/usuarios.controller");

// Sin tokens: pasas usuario_id por body o query cuando aplique
r.get("/by-ra/:ra", c.findByRA);
r.get("/:id", c.getById);
r.put("/:id", c.updatePerfil);

module.exports = r;