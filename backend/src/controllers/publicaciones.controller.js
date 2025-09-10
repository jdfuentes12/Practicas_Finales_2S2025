const { pool } = require("../db");

exports.list = async (req, res, next) => {
  try {
    const { page = 1, size = 10, curso_id, docente_id, tipo } = req.query;
    const limit = Math.min(parseInt(size), 50);
    const offset = (parseInt(page) - 1) * limit;

    const where = [];
    const params = {};
    if (tipo) {
      where.push(`p.tipo_objetivo = :tipo`);
      params.tipo = tipo;
    }
    if (curso_id) {
      where.push(`p.curso_id = :curso_id`);
      params.curso_id = curso_id;
    }
    if (docente_id) {
      where.push(`p.docente_id = :docente_id`);
      params.docente_id = docente_id;
    }
    const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT p.id, p.tipo_objetivo, p.curso_id, p.docente_id, p.mensaje, p.creado_en,
              u.registro_academico, u.nombres, u.apellidos,
              c.nombre AS curso_nombre, d.nombres AS docente_nombres, d.apellidos AS docente_apellidos
       FROM publicaciones p
       JOIN usuarios u ON u.id = p.usuario_id
       LEFT JOIN cursos c ON c.id = p.curso_id
       LEFT JOIN docentes d ON d.id = p.docente_id
       ${whereSQL}
       ORDER BY p.creado_en DESC
       LIMIT :limit OFFSET :offset`,
      { ...params, limit, offset }
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { usuario_id, tipo_objetivo, curso_id, docente_id, mensaje } =
      req.body;
    if (!usuario_id || !mensaje || !tipo_objetivo)
      return res
        .status(400)
        .json({ error: "Faltan campos: usuario_id, mensaje, tipo_objetivo" });

    const [result] = await pool.query(
      `INSERT INTO publicaciones (usuario_id, tipo_objetivo, curso_id, docente_id, mensaje)
       VALUES (:uid, :tipo, :cid, :did, :msg)`,
      {
        uid: usuario_id,
        tipo_objetivo,
        cid: curso_id || null,
        did: docente_id || null,
        msg: mensaje,
      }
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
};

exports.detail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[pub]] = await pool.query(
      `SELECT p.*, u.registro_academico, u.nombres, u.apellidos
       FROM publicaciones p JOIN usuarios u ON u.id=p.usuario_id
       WHERE p.id=:id`,
      { id }
    );
    if (!pub) return res.status(404).json({ error: "No encontrada" });
    const [coms] = await pool.query(
      `SELECT c.id, c.contenido, c.creado_en,
              u.registro_academico, u.nombres, u.apellidos
       FROM comentarios c JOIN usuarios u ON u.id=c.usuario_id
       WHERE c.publicacion_id=:id ORDER BY c.creado_en ASC`,
      { id }
    );
    res.json({ ...pub, comentarios: coms });
  } catch (err) {
    next(err);
  }
};