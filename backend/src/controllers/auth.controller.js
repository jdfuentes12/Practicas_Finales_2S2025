const {pool} = require('../db');
const {hash, compare} = require('../utils/cryto');
const cryto = require("crypto");

exports.register = async (req, res, next) => {
  try {
    const { registro_academico, nombres, apellidos, email, password } =
      req.body;
    if (!registro_academico || !nombres || !apellidos || !email || !password)
      return res.status(400).json({ error: "Faltan campos" });

    const password_hash = await hash(password);
    const [result] = await pool.query(
      `INSERT INTO usuarios (registro_academico, nombres, apellidos, email, password_hash)
       VALUES (:ra, :nom, :ape, :email, :phash)`,
      {
        ra: registro_academico,
        nom: nombres,
        ape: apellidos,
        email,
        phash: password_hash,
      }
    );
    await pool.query(`INSERT INTO perfiles (usuario_id) VALUES (:id)`, {
      id: result.insertId,
    });

    res.status(201).json({ ok: true, usuario_id: result.insertId });
  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { registro_academico, password } = req.body;
    const [[user]] = await pool.query(
      `SELECT * FROM usuarios WHERE registro_academico=:ra`,
      { ra: registro_academico }
    );
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
    const ok = await compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });
    res.json({ ok: true, usuario_id: user.id });
  } catch (err) {
    next(err);
  }
};