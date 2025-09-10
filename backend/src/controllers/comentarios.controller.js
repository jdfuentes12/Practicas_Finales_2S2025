const { pool } = require("../db");

exports.create = async (req, res, next) => {
  try {
    const { publicacion_id, usuario_id, contenido } = req.body;
    if (!publicacion_id || !usuario_id || !contenido)
      return res
        .status(400)
        .json({
          error: "Faltan campos: publicacion_id, usuario_id, contenido",
        });

    const [[p]] = await pool.query(
      `SELECT id FROM publicaciones WHERE id=:id`,
      { id: publicacion_id }
    );
    if (!p) return res.status(404).json({ error: "Publicación no existe" });

    const [result] = await pool.query(
      `INSERT INTO comentarios (publicacion_id, usuario_id, contenido)
       VALUES (:pid, :uid, :cont)`,
      { pid: publicacion_id, uid: usuario_id, cont: contenido }
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
};