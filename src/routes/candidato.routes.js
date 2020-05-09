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

  let candidatoo;
  try {
    candidatoo = await candidato.save();
  } catch (error) {
    res
      .status(400)
      .json({ status: "fail", mensaje: "Error al crear candidato" });
  }

  res
    .status(201)
    .json({ status: "success", mensaje: "Candidat@ creado", data: candidatoo });
});

router.patch("/:id", async (req, res) => {
  if (req.files.image) {
    let splitPath;
    //Para que funcione en servidores linux y windows
    if (process.env.ON_HEROKU !== "TRUE") {
      splitPath = req.files.image.path.split("\\");
    } else {
      splitPath = req.files.image.path.split("/");
    }
    req.body.foto = splitPath[splitPath.length - 1];
  }

  if (req.files.curriculum) {
    let splitPath;
    if (process.env.ON_HEROKU !== "TRUE") {
      splitPath = req.files.curriculum.path.split("\\");
    } else {
      splitPath = req.files.curriculum.path.split("/");
    }
    req.body.cv = splitPath[splitPath.length - 1];
  }
  console.log(req.body);

  const candidato = await Candidato.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    mensaje: "Candidat@ actualizada",
    status: "success",
    data: candidato,
  });
});

router.delete("/:id", async (req, res) => {
  await Candidato.findByIdAndRemove(req.params.id);
  res.json({ status: "Candidato eliminada" });
}),
  (module.exports = router);
