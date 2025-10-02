const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto"); // Asegúrate de que la ruta sea correcta

// Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    console.log("Recibido:", req.body); // Depuración: verifica qué llega
    const { nombre, precio, categoria } = req.body;

    // Validación básica
    if (!nombre || !precio || !categoria) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const nuevoProducto = new Producto({ nombre, precio, categoria });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (err) {
    console.error("Error al guardar producto:", err); // Depuración
    res.status(500).json({ message: "Error al agregar el producto" });
  }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    console.log("Productos encontrados:", productos); // Depuración
    res.json(productos);
  } catch (err) {
    console.error("Error al obtener productos:", err); // Depuración
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Intentando eliminar producto con ID:", id); // Depuración
    const productoEliminado = await Producto.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    console.log("Producto eliminado:", productoEliminado); // Depuración
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar producto:", err); // Depuración
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});

module.exports = router;