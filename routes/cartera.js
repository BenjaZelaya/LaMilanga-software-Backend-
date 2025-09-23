const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const facturasPath = path.join(__dirname, "../data/facturas.json");
const gastosPath = path.join(__dirname, "../data/gastos.json");

// 📌 Obtener resumen de cartera
router.get("/", (req, res) => {
  try {
    const facturasData = fs.readFileSync(facturasPath, "utf8");
    const gastosData = fs.readFileSync(gastosPath, "utf8");

    const facturas = JSON.parse(facturasData || "[]");
    const gastos = JSON.parse(gastosData || "[]");

    const ingresos = facturas.reduce((acc, f) => acc + Number(f.total || 0), 0);
    const egresos = gastos.reduce((acc, g) => acc + Number(g.monto || 0), 0);
    const saldo = ingresos - egresos;

    res.json({
      ingresos,
      egresos,
      saldo,
      facturas,
      gastos,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al calcular cartera" });
  }
});

module.exports = router;
