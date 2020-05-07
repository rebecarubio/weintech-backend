const express = require("express");
const router = express.Router();
const Oferta = require("../models/oferta");
const APIFeatures = require("../apiFeatures");

router.get("/", async (req, res) => {
  console.log(req.query);
  const features = new APIFeatures(Oferta.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const ofertas = await features.query;
  res.status(201);
  res.json({ status: "success", data: ofertas });
});

router.get("/buscar", async (req, res) => {
  console.log(req.query);
  const { titulo, sector, provincia, empresa, salarioDesde } = req.query;

  const queryObject = {};

  if (titulo) queryObject.titulo = { $regex: titulo, $options: "i" };

  if (sector) queryObject.sector = sector;
  if (provincia) queryObject.provincia = provincia;
  //if (empresa) queryObject.empresa = { $regex: empresa, $options: "i" };
  if (salarioDesde) queryObject.salario = { $gte: salarioDesde };

  /*
  const ofertas = await Oferta.find({
    titulo: { $regex: titulo, $options: "i" }, //Busca titulos similares %LIKE, case insensitive
    sector: sector,
    provincia: provincia,
    empresa: { $regex: empresa, $options: "i" },
    salario: { $gte: salarioDesde },
  });
*/

  const ofertas = await Oferta.find(queryObject);

  res.status(201);
  res.json({ status: "success", data: ofertas });
});

router.get("/:id", async (req, res) => {
  console.log(req.query.populate);
  const oferta = !req.query.populate
    ? await Oferta.findById(req.params.id)
    : await (await Oferta.findById(req.params.id))
        .populate("candidatos")
        .execPopulate();
  res.json(oferta);
});

//Buscar ofertas de un candidato
router.get("/:candidatoId", async (req, res) => {
  console.log(oferta.candidatos);
  let ofertas = await Oferta.find({
    candidatos: { $in: [mongoose.Candidato._id(req.params.id)] },
  });
  res.json({ status: "success", data: ofertas });
});

router.get("/:id_provincia", async (req, res) => {
  const oferta = await Oferta.findById(req.params.id_provincia);
  res.json(oferta);
});

router.post("/", async (req, res) => {
  const oferta = new Oferta(req.body);
  await oferta.save();
  res.status(201).json({ status: "success" });
});

router.patch("/:id", async (req, res) => {
  const newOferta = req.body;
  await Oferta.findByIdAndUpdate(req.params.id, newOferta, {
    runValidators: true,
  });
  res.json({ status: "Oferta actualizada" });
});

router.patch("/:id/inscribeCandidato", async (req, res) => {
  console.log(req.body);
  Oferta.findByIdAndUpdate(
    req.params.id,
    { $push: { candidatos: req.body.candidatoId } },
    { safe: true, upsert: true, new: true, runValidators: true },
    function (err, model) {
      console.log(err);
    }
  );
  res.json({ status: "success", message: "Candidato inscrito" });
});

router.delete("/:id", async (req, res) => {
  await Oferta.findByIdAndRemove(req.params.id);
  res.json({ status: "Oferta eliminada" });
}),
  (module.exports = router);
