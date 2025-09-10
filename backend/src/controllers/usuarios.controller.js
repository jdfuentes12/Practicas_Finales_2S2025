const { pool } = require("../db");

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[u]] = await pool.query(
      `SELECT u.id, u.registro_academico, u.nombres, u.apellidos, u.email,
              p.biografia, p.avatar_url
       FROM usuarios u LEFT JOIN perfiles p ON p.usuario_id=u.id
       WHERE u.id=:id`,
      { id }
    );
    if (!u) return res.status(404).json({ error: "No existe" });
    res.json(u);
  } catch (e) {
    next(e);
  }
};

exports.updatePerfil = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { biografia, avatar_url, nombres, apellidos, email } = req.body;
    await pool.query(
      `UPDATE perfiles SET biografia=:b, avatar_url=:a WHERE usuario_id=:id`,
      { b: biografia || null, a: avatar_url || null, id }
    );
    await pool.query(
      `UPDATE usuarios SET nombres=:n, apellidos=:ap, email=:em WHERE id=:id`,
      { n: nombres, ap: apellidos, em: email, id }
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};

exports.findByRA = async (req, res, next) => {
  try {
    const { ra } = req.params;
    const [[u]] = await pool.query(
      `SELECT u.id, u.registro_academico, u.nombres, u.apellidos, u.email
       FROM usuarios u WHERE u.registro_academico=:ra`,
      { ra }
    );
    if (!u) return res.status(404).json({ error: "No existe" });
    res.json(u);
  } catch (e) {
    next(e);
  }
};