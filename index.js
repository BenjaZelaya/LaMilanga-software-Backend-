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
app.use(express.json());

// Rutas
app.use("/facturas", facturasRoutes);
app.use("/gastos", gastosRoutes);
app.use("/cartera", carteraRoutes);
app.use("/users", usersRoutes);
app.use("/productos", productosRoutes);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err);
  });