const { pool } = require("../db");

exports.list = async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM cursos ORDER BY codigo`);
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { codigo, nombre, creditos } = req.body;
    const [r] = await pool.query(
      `INSERT INTO cursos (codigo, nombre, creditos) VALUES (:c,:n,:cr)`,
      { c: codigo, n: nombre, cr: creditos }
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    next(e);
  }
};