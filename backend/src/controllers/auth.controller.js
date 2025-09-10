const { pool } = require("../db");
const { hash, compare } = require("../utils/crypto");
const crypto = require("crypto");

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

exports.forgot = async (req, res, next) => {
  try {
    const { registro_academico, email } = req.body;
    const [[user]] = await pool.query(
      `SELECT id FROM usuarios WHERE registro_academico=:ra AND email=:email`,
      { ra: registro_academico, email }
    );
    if (!user) return res.status(404).json({ error: "Datos no coinciden" });

    const token = crypto.randomBytes(24).toString("hex");
    const expira = new Date(Date.now() + 1000 * 60 * 30);
    await pool.query(
      `INSERT INTO password_resets (usuario_id, token, expira_en) VALUES (:id,:t,:e)`,
      { id: user.id, t: token, e: expira }
    );
    res.json({ ok: true, reset_token: token, expira_en: expira });
  } catch (err) {
    next(err);
  }
};

exports.reset = async (req, res, next) => {
  try {
    const { token, nueva_password } = req.body;
    const [[row]] = await pool.query(
      `SELECT * FROM password_resets WHERE token=:t AND consumido=FALSE AND expira_en > NOW()`,
      { t: token }
    );
    if (!row)
      return res.status(400).json({ error: "Token inválido o vencido" });

    const password_hash = await hash(nueva_password);
    await pool.query(`UPDATE usuarios SET password_hash=:p WHERE id=:id`, {
      p: password_hash,
      id: row.usuario_id,
    });
    await pool.query(`UPDATE password_resets SET consumido=TRUE WHERE id=:id`, {
      id: row.id,
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};