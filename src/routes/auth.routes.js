const express = require("express");
const router = express.Router();
const Candidato = require("../models/candidato");
const Empresa = require("../models/empresa");

router.get("/", async (req, res) => {
  const candidatos = await Candidato.find();
  res.json(candidatos);
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const candidato = await Candidato.findOne({ email }).select("+password");
  console.log(candidato);

  if (
    !candidato ||
    !(await candidato.comparePassword(password, candidato.password))
  ) {
    return res.status(401).json({
      status: "fail",
      mensaje: "No hay candidato con este email/password",
    });
  }

  res.status(201);
  res.json({ status: "success", data: candidato });
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  let candidato = await Candidato.findOne({ email: req.body.email });
  const { email, password, nombre, primerapellido, segundoapellido } = req.body;

  if (candidato) {
    res.status(400);
    res.json({ status: "fail", mensaje: "Usuario ya existe", data: "" });
  } else {
    candidato = new Candidato({
      email,
      password,
      nombre,
      primerapellido,
      segundoapellido,
    });
    await candidato.save();
    res.status(201);
    res.json({
      status: "success",
      data: candidato,
    });
  }
});

router.post("/loginempresa", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  const empresa = await Empresa.findOne({ email }).select("+password");
  console.log("EMPRESA: " + empresa);

  try {
    if (
      !empresa ||
      !(await empresa.comparePassword(password, empresa.password))
    ) {
      return res.status(401).json({
        status: "fail",
        mensaje: "No existe ninguna empresa registrada con ese email",
        data: "",
      });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
  res.status(201);
  res.json({ status: "success", data: empresa });
});

router.post("/signupempresa", async (req, res) => {
  console.log(req.body);
  let empresa = await Empresa.findOne({ email: req.body.email });
  const { nombre, sector, email, password } = req.body;

  if (empresa) {
    res.status(400);
    res.json({ status: "fail", mensaje: "Empresa ya existe", data: "" });
  } else {
    empresa = new Empresa({
      nombre,
      sector,
      email,
      password,
    });
    await empresa.save();
    res.status(201);
    res.json({ status: "success", data: empresa });
  }
});

module.exports = router;
