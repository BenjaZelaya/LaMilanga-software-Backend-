const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Rutas
const facturasRoutes = require("./routes/facturas");
const gastosRoutes = require("./routes/gastos");
const carteraRoutes = require("./routes/cartera");
const usersRoutes = require("./routes/users");
const productosRoutes = require("./routes/productos");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Middleware para parsear JSON
app.use((req, res, next) => {
  console.log("📥 Recibido:", req.method, req.url, "Body:", req.body); // Log del body
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas exitosamente");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    console.error("Detalles del error:", err.stack);
    process.exit(1); // Termina el proceso si no se conecta
  });

// Manejo de eventos de reconexión
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Desconectado de MongoDB. Intentando reconectar...");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 Reconectado a MongoDB exitosamente");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Error en la conexión a MongoDB:", err.message);
});

// Rutas
app.use("/facturas", facturasRoutes);
app.use("/gastos", gastosRoutes);
app.use("/cartera", carteraRoutes);
app.use("/users", usersRoutes);
app.use("/productos", productosRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error global:", err.stack);
  res.status(500).json({ error: "Error interno del servidor", details: err.message });
});
