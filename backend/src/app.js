const express = require("express");
const cors = require("cors");
require("dotenv").config();


const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true, service: "Api funcionando" }));

app.use("/api/auth", authRoutes);


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Informe 4 - api escuchando en :${port}`));