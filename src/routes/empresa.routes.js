const express = require("express");
const router = express.Router();
const Empresa = require("../models/empresa");

router.get("/", async (req, res) => {
  const empresas = await Empresa.find();
  res.json(empresas);
});

router.get("/:id", async (req, res) => {
  const empresa = await Empresa.findById(req.params.id);
  res.json(empresa);
});

router.post("/", async (req, res) => {
  const {
    email,
    password,
    nombre,
    descripcion,
    foto,
    sector,
    telefono,
  } = req.body;
  const empresa = new Empresa({
    email,
    password,
    nombre,
    descripcion,
    foto,
    sector,
    telefono,
  });

  let empresaa;
  try {
    await empresa.save();
  } catch (error) {
    res.status(400).json({ status: "fail", mensaje: "Error al crear empresa" });
  }
  res
    .status(201)
    .json({ status: "success", mensaje: "Empresa creada", data: empresaa });
});

router.patch("/:id", async (req, res) => {
  if (req.files.image) {
    const splitPath = req.files.image.path.split("\\");
    req.body.foto = splitPath[splitPath.length - 1];
  }
  const newEmpresa = req.body;
  await Empresa.findByIdAndUpdate(req.params.id, newEmpresa, {
    runValidators: true,
  });

  res.json({ status: "Empresa actualizada" });
});

router.delete("/:id", async (req, res) => {
  await Empresa.findByIdAndRemove(req.params.id);
  res.json({ status: "Empresa eliminada" });
}),
  (module.exports = router);
