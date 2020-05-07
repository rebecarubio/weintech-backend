"use strict";

//DB
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

const EmpresaSchema = new Schema({
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: { type: String, select: false, require: true },
  nombre: { type: String },
  web: { type: String },
  provincia: { type: String },
  direccion: { type: String },
  descripcion: { type: String },
  foto: { type: String },
  sector: { type: String },
  telefono: { type: String },
  ofertas: [{ type: Schema.Types.ObjectId, ref: "Oferta" }],
  CIF: { type: String },
});

//Hash password
EmpresaSchema.pre("save", function (next) {
  let empresa = this;
  if (!empresa.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(empresa.password, salt, function (err, hash) {
      if (err) return next(err);

      empresa.password = hash;
      next();
    });
  });
});

EmpresaSchema.methods.comparePassword = async function (
  empresaPassword,
  password
) {
  console.log(empresaPassword + " " + password);
  return await bcrypt.compare(empresaPassword, password);
};

module.exports = mongoose.model("Empresa", EmpresaSchema);
