const express = require("express");
const router = express.Router();
const Candidato = require("../models/candidato");
const APIFeatures = require("../apiFeatures");

router.get("/", async (req, res) => {
  console.log(req.query);
  const features = new APIFeatures(Candidato.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const candidatos = await features.query;
  res.status(201);
  res.json({ status: "success", data: candidatos });
});

router.get("/", async (req, res) => {
  const candidatos = await Candidato.find();
  res.json(candidatos);
});

router.get("/buscar", async (req, res) => {
  console.log(req.query);
  const { profesion, provincia } = req.query;

  const queryObject = {};

  if (profesion) queryObject.profesion = { $regex: profesion, $options: "i" };
  if (provincia) queryObject.provincia = provincia;
  //if (empresa) queryObject.empresa = { $regex: empresa, $options: "i" };

  const candidatos = await Candidato.find(queryObject);

  res.status(201);
  res.json({ status: "success", data: candidatos });
});

router.get("/:id", async (req, res) => {
  const candidato = await Candidato.findById(req.params.id);
  res.json(candidato);
});

router.post("/", async (req, res) => {
  const {
    email,
    password,
    nombre,
    primerapellido,
    segundoapellido,
    cv,
    provincia,
    profesion,
    foto,
    telefono,
  } = req.body;
  const candidato = new Candidato({
    email,
    password,
    nombre,
    primerapellido,
    segundoapellido,
    cv,
    provincia,
    profesion,
    foto,
    telefono,
  });
  await candidato.save();
  res.json({ status: "Candidat@ guardado" });
});

router.patch("/:id", async (req, res) => {
  if (req.files.image) {
    const splitPath = req.files.image.path.split("\\");
    req.body.foto = splitPath[splitPath.length - 1];
  }

  if (req.files.curriculum) {
    const splitPath = req.files.curriculum.path.split("\\");
    req.body.cv = splitPath[splitPath.length - 1];
  }

  const newCandidato = req.body;
  await Candidato.findByIdAndUpdate(req.params.id, newCandidato, {
    //new: true,
    runValidators: true,
  });

  res.json({ status: "Candidat@ actualizada" });
});

router.delete("/:id", async (req, res) => {
  await Candidato.findByIdAndRemove(req.params.id);
  res.json({ status: "Candidato eliminada" });
}),
  (module.exports = router);
