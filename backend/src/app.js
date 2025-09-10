const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const cursosRoutes = require("./routes/cursos.routes");
const docentesRoutes = require("./routes/docentes.routes");
const publicacionesRoutes = require("./routes/publicaciones.routes");
const comentariosRoutes = require("./routes/comentarios.routes");
const aprobadosRoutes = require("./routes/aprobados.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true, service: "api-no-auth" }));

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/cursos", cursosRoutes);
app.use("/api/docentes", docentesRoutes);
app.use("/api/publicaciones", publicacionesRoutes);
app.use("/api/comentarios", comentariosRoutes);
app.use("/api/aprobados", aprobadosRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API (no-auth) escuchando en :${port}`));