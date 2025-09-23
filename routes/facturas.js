const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../data/facturas.json");

// 📌 Obtener todas las facturas
router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const facturas = JSON.parse(data || "[]");
    res.json(facturas);
  } catch (err) {
    res.status(500).json({ error: "Error al leer facturas" });
  }
});

// 📌 Crear factura
router.post("/", (req, res) => {
  try {
    const { cliente, turno, productos, total } = req.body;

    if (!cliente || !turno || !productos || productos.length === 0 || !total) {
      return res.status(400).json({ error: "Cliente, turno, productos y total son obligatorios" });
    }

    const data = fs.readFileSync(filePath, "utf8");
    let facturas = JSON.parse(data || "[]");

    // 🔄 Fecha en formato ISO (yyyy-mm-dd)
    const now = new Date();
    const fechaISO = now.toISOString().split("T")[0];
    const hora = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const nuevaFactura = {
      id: facturas.length > 0 ? facturas[facturas.length - 1].id + 1 : 1,
      cliente,
      turno,
      productos,
      total: Number(total),
      fecha: fechaISO, // Formato ISO compatible con <input type="date">
      hora,
    };

    facturas.push(nuevaFactura);
    fs.writeFileSync(filePath, JSON.stringify(facturas, null, 2));

    res.status(201).json({ message: "Factura guardada", factura: nuevaFactura });
  } catch (err) {
    res.status(500).json({ error: "Error al guardar factura" });
  }
});

// 📌 Eliminar factura
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const data = fs.readFileSync(filePath, "utf8");
    let facturas = JSON.parse(data || "[]");

    const index = facturas.findIndex((f) => f.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    facturas.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(facturas, null, 2));

    res.json({ message: "Factura eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar factura" });
  }
});

module.exports = router;
