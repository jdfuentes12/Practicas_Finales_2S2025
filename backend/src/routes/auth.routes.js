const r = require("express").Router();
const c = require("../controllers/auth.controller");

// Nota: estas rutas no devuelven JWT; solo crean/verifican usuario.
r.post("/register", c.register);
r.post("/login", c.login);
r.post("/forgot", c.forgot);
r.post("/reset", c.reset);

module.exports = r;