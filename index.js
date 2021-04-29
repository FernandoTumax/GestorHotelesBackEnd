const express = require("express");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");

const logger = require("./utils/logger");
const authJWT = require("./api/libs/auth");
const config = require("./config");
const errorHandler = require("./api/libs/errorHandler");
const userRouter = require("./api/recursos/Usuarios/usuarios.routes");

passport.use(authJWT);

mongoose.connect("mongodb://127.0.0.1:27017/gestorhoteles");
mongoose.connection.on("error", () => {
  logger.error("Fallo la conexion a mongodb");
  process.exit(1);
});

mongoose.set("useFindAndModify", false);

const app = express();

app.use(bodyparser.json());

app.use(
  morgan("short", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(passport.initialize());

app.use("/usuarios", userRouter);

app.use(errorHandler.procesarErroresDeDB);
if (config.ambiente === "prod") {
  app.use(errorHandler.erroresEnProduccion);
} else {
  app.use(errorHandler.erroresEnDesarrollo);
}

const server = app.listen(config.puerto, () => {
  logger.info("Escuchando en el puerto 3000");
});

module.exports = {
  app,
  server,
};