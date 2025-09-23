const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const facturasRoutes = require("./routes/facturas");
const gastosRoutes = require("./routes/gastos");
const carteraRoutes = require("./routes/cartera");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/facturas", facturasRoutes);
app.use("/gastos", gastosRoutes);
app.use("/cartera", carteraRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
