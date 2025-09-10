const { pool } = require("../db");

exports.list = async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM docentes ORDER BY apellidos, nombres`
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { nombres, apellidos, email } = req.body;
    const [r] = await pool.query(
      `INSERT INTO docentes (nombres, apellidos, email) VALUES (:n,:a,:e)`,
      { n: nombres, a: apellidos, e: email || null }
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    next(e);
  }
};

exports.linkCurso = async (req, res, next) => {
  try {
    const { curso_id, docente_id } = req.body;
    const [r] = await pool.query(
      `INSERT INTO curso_docente (curso_id, docente_id) VALUES (:c,:d)`,
      { c: curso_id, d: docente_id }
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    next(e);
  }
};