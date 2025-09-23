const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../data/gastos.json");

// 📌 Obtener todos los gastos
router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const gastos = JSON.parse(data || "[]");
    res.json(gastos);
  } catch (err) {
    res.status(500).json({ error: "Error al leer gastos" });
  }
});

// 📌 Crear gasto
router.post("/", (req, res) => {
  try {
    const { nombre, monto } = req.body;

    if (!nombre || !monto) {
      return res.status(400).json({ error: "Nombre y monto son obligatorios" });
    }

    const data = fs.readFileSync(filePath, "utf8");
    let gastos = JSON.parse(data || "[]");

    const nuevoGasto = {
      id: gastos.length > 0 ? gastos[gastos.length - 1].id + 1 : 1,
      nombre,
      monto: Number(monto),
      fecha: new Date().toLocaleDateString("es-AR"),
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    gastos.push(nuevoGasto);
    fs.writeFileSync(filePath, JSON.stringify(gastos, null, 2));

    res.status(201).json({ message: "Gasto guardado correctamente", gasto: nuevoGasto });
  } catch (err) {
    res.status(500).json({ error: "Error al guardar gasto" });
  }
});

// 📌 Eliminar gasto
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const data = fs.readFileSync(filePath, "utf8");
    let gastos = JSON.parse(data || "[]");

    const index = gastos.findIndex((g) => g.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Gasto no encontrado" });
    }

    gastos.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(gastos, null, 2));

    res.json({ message: "Gasto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar gasto" });
  }
});

module.exports = router;
