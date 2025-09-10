const { pool } = require("../db");

exports.listByUser = async (req, res, next) => {
  try {
    const usuario_id = req.params.usuario_id;
    const [rows] = await pool.query(
      `SELECT ca.id, ca.fecha_aprobacion, c.codigo, c.nombre, c.creditos
       FROM cursos_aprobados ca JOIN cursos c ON c.id=ca.curso_id
       WHERE ca.usuario_id=:id ORDER BY c.codigo`,
      { id: usuario_id }
    );
    const total_creditos = rows.reduce((acc, r) => acc + r.creditos, 0);
    res.json({ usuario_id, cursos: rows, total_creditos });
  } catch (e) {
    next(e);
  }
};

exports.add = async (req, res, next) => {
  try {
    const { usuario_id, curso_id, fecha_aprobacion } = req.body;
    if (!usuario_id || !curso_id)
      return res
        .status(400)
        .json({ error: "Faltan campos: usuario_id, curso_id" });
    const [r] = await pool.query(
      `INSERT INTO cursos_aprobados (usuario_id, curso_id, fecha_aprobacion)
       VALUES (:u,:c,:f)`,
      { u: usuario_id, c: curso_id, f: fecha_aprobacion || null }
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    next(e);
  }
};