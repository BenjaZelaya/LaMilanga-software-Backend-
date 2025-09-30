const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../data/facturas.json");

// 📌 Obtener todas las facturas
router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const facturas = JSON.parse(data || "[]");
    res.json(facturas);
  } catch (err) {
    console.error("Error al leer facturas:", err);
    res.status(500).json({ error: "Error al leer facturas" });
  }
});

// 📌 Crear factura
router.post("/", async (req, res) => {
  try {
    const { cliente, turno, productos, total } = req.body;

    if (!cliente || !turno || !productos || productos.length === 0 || !total) {
      return res.status(400).json({ error: "Cliente, turno, productos y total son obligatorios" });
    }

    let facturas = [];
    try {
      const data = await fs.readFile(filePath, "utf8");
      facturas = JSON.parse(data || "[]");
    } catch (err) {
      // Si el archivo no existe, inicializa un array vacío
    }

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
      fecha: fechaISO,
      hora,
    };

    facturas.push(nuevaFactura);
    await fs.writeFile(filePath, JSON.stringify(facturas, null, 2));

    res.status(201).json({ message: "Factura guardada", factura: nuevaFactura });
  } catch (err) {
    console.error("Error al guardar factura:", err);
    res.status(500).json({ error: "Error al guardar factura" });
  }
});

// 📌 Eliminar factura
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const data = await fs.readFile(filePath, "utf8");
    let facturas = JSON.parse(data || "[]");

    const index = facturas.findIndex((f) => f.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    facturas.splice(index, 1);
    await fs.writeFile(filePath, JSON.stringify(facturas, null, 2));

    res.json({ message: "Factura eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar factura:", err);
    res.status(500).json({ error: "Error al eliminar factura" });
  }
});

module.exports = router;