"use strict";

//DB
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

const CandidatoSchema = new Schema({
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: { type: String, select: false, require: true },
  nombre: { type: String },
  primerapellido: { type: String },
  segundoapellido: { type: String },
  cv: { type: String },
  provincia: { type: String },
  profesion: { type: String },
  foto: { type: String, default: "default.jpg" },
  telefono: { type: String },
  direccion: { type: String },
});

//Hash password
CandidatoSchema.pre("save", function (next) {
  let candidato = this;
  if (!candidato.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(candidato.password, salt, function (err, hash) {
      if (err) return next(err);

      candidato.password = hash;
      next();
    });
  });
});

CandidatoSchema.methods.comparePassword = async function (
  candidatoPassword,
  password
) {
  return await bcrypt.compare(candidatoPassword, password);
  /*
    bcrypt.compare(candidatoPassword, this.password, function (err, isMatch) {
        if(err) return callback(err)
        callback(undefined, isMatch);
    });*/
};

module.exports = mongoose.model("Candidato", CandidatoSchema);
