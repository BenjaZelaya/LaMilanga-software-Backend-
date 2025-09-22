const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "..", "data", "gastos.json");

// ✅ Obtener todos los gastos
router.get("/", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "No se pudo leer el archivo" });
    const gastos = JSON.parse(data || "[]");
    res.json(gastos);
  });
});

// ✅ Agregar un nuevo gasto
router.post("/", (req, res) => {
  const { nombre, monto } = req.body;

  if (!nombre || !monto) {
    return res.status(400).json({ error: "Nombre y monto son obligatorios" });
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    let gastos = [];
    if (!err && data) gastos = JSON.parse(data);

    const nuevoGasto = {
      id: gastos.length > 0 ? gastos[gastos.length - 1].id + 1 : 1, // ID autoincremental
      nombre,
      monto,
      fecha: new Date().toLocaleDateString("es-AR"), // dd/mm/yyyy
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    gastos.push(nuevoGasto);

    fs.writeFile(filePath, JSON.stringify(gastos, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "No se pudo guardar el gasto" });
      res.status(201).json({ message: "Gasto guardado correctamente", gasto: nuevoGasto });
    });
  });
});

// ✅ Eliminar gasto por ID
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "No se pudo leer el archivo" });

    let gastos = JSON.parse(data || "[]");
    const index = gastos.findIndex((g) => g.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Gasto no encontrado" });
    }

    gastos.splice(index, 1);

    fs.writeFile(filePath, JSON.stringify(gastos, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "No se pudo borrar el gasto" });
      res.json({ message: "Gasto eliminado correctamente" });
    });
  });
});

module.exports = router;
