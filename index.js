const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const facturasRoutes = require("./routes/facturas");
const gastosRoutes = require("./routes/gastos");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Montar las rutas
app.use("/facturas", facturasRoutes);
app.use("/gastos", gastosRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
