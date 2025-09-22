const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../data/facturas.json");

// 📌 Obtener facturas
router.get("/", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "No se pudo leer el archivo" });
    const facturas = JSON.parse(data || "[]");
    res.json(facturas);
  });
});

// 📌 Crear factura
router.post("/", (req, res) => {
  const { cliente, turno, productos, total } = req.body;

  if (!cliente || !turno || !productos || productos.length === 0 || !total) {
    return res.status(400).json({ error: "Cliente, turno, productos y total son obligatorios" });
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    let facturas = [];
    if (!err && data) facturas = JSON.parse(data);

    const nuevaFactura = {
      id: facturas.length > 0 ? facturas[facturas.length - 1].id + 1 : 1,
      cliente,
      turno,
      productos,
      total,
      fecha: new Date().toLocaleDateString("es-AR"),
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    facturas.push(nuevaFactura);

    fs.writeFile(filePath, JSON.stringify(facturas, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "No se pudo guardar la factura" });
      res.status(201).json({ message: "Factura guardada", factura: nuevaFactura });
    });
  });
});

// 📌 Eliminar factura
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "No se pudo leer el archivo" });

    let facturas = JSON.parse(data || "[]");
    const index = facturas.findIndex((f) => f.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    facturas.splice(index, 1);

    fs.writeFile(filePath, JSON.stringify(facturas, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "No se pudo borrar la factura" });
      res.json({ message: "Factura eliminada correctamente" });
    });
  });
});

module.exports = router;
