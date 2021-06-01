const express = require("express");
const passport = require("passport");

const log = require("./../../../utils/logger");
const validarReservacion =
  require("./reservaciones.validate").validarReservacion;
const reservationController = require("./reservaciones.controller");
const userController = require("./../Usuarios/usuarios.controller");
const hotelController = require("./../Hoteles/hoteles.controller");
const servicesController = require('./../Servicios/servicios.controller');
const roomController = require("./../Habitaciones/habitacion.controller");
const producerMQ = require('./reservaciones.queue')
const procesarErrores = require("./../../libs/errorHandler").procesarErrores;
const {
  ServicioNoExiste,
  ReservacionNoExiste,
  HotelNoExiste,
  HabitacionNoExiste,
} = require("./reservaciones.error");


const jwtAuthenticate = passport.authenticate("jwt", { session: false });
const reservationRouter = express.Router();

function validarId(req, res, next) {
  let id = req.params.id;

  if (id.match(/^[a-fA-F0-9]{24}$/) === null) {
    res.status(400).send(`El id ${id} suministrado en el URL no es valido`);
    return;
  }
  next();
}
function validarIds(req, res, next) {
  let id = req.params.idR;

  if (id.match(/^[a-fA-F0-9]{24}$/) === null) {
    res.status(400).send(`El id ${id} suministrado en el URL no es valido`);
    return;
  }
  next();
}

reservationRouter.get(
  "/",
  procesarErrores((req, res) => {
    return reservationController.foundReservation().then((reservaciones) => {
      res.json(reservaciones);
    });
  })
);

reservationRouter.get('/oneReservation/:id', jwtAuthenticate, procesarErrores((req, res) => {
  let idReservacion = req.params.id;
    return reservationController.foundOneReservacion({id: idReservacion}).then((reservacion) => {
      res.json(reservacion);
    })
}))

reservationRouter.post(
  "/:idH/:idR/:idC/set",
  [validarReservacion, jwtAuthenticate],
  procesarErrores(async (req, res) => {
    let nuevaReservacion = req.body;
    let fechaIngreso = req.body.fechaIngreso;
    let fechaSalida = req.body.fechaSalida;
    let idUser = req.params.idC;
    let idHotel = req.params.idH;
    let idRoom = req.params.idR;
    let disp = "ocupado";

    log.info(``)

    reservationController
      .setReservation(nuevaReservacion, fechaIngreso, fechaSalida)
      .then((nuevaReservacionCreada) => {
        if (nuevaReservacionCreada) {
          producerMQ.publicMessage(nuevaReservacionCreada, 'facturacionKey').then(resultado => {
            log.info('Se encolo la reservacion para el envio de la factura')
          }).catch(err => {
            log.error('No se provoco un error al momento de encolar la factura', err)
          })
          log.info("Reservacion creada con exito");
          userController
            .setHistory(idUser, nuevaReservacionCreada.id)
            .then((reservacionSeteada) => {
              log.info(
                `el usuario con id [${idUser}] fue actualizado con su nueva reservacion y agregada a su historial [${nuevaReservacionCreada.id}]`
              );
              hotelController
                .setReservation(idHotel, nuevaReservacionCreada.id)
                .then((reservacionSeteadaHotel) => {
                  log.info(
                    `El hotel con id [${idHotel}] fue actualizado con una reservacion de un cliente`
                  );
                      hotelController
                        .setSolicitud(idHotel)
                        .then((solicitudActualizada) => {
                          log.info(
                            `Se ha incrementado las solicitudes del hotel`
                          );
                          roomController.updateAvailability(idRoom, disp).then(setearDiso => {
                            log.info(`El id ${idRoom} pasa a estar ocupada`)
                            res.json(nuevaReservacionCreada);
                            res.status(201)
                          })
                        });
                });
            });
        }
      });
  })
);

reservationRouter.delete(
  "/:idRS/:idR/:idH",
  [jwtAuthenticate, validarIds],
  procesarErrores(async (req, res) => {
    let idReservacion = req.params.idRS;
    let reservacionEliminar;
    let idRoom = req.params.idR;
    let idHotel = req.params.idH;
    let disp = "disponible";

    reservacionEliminar = await reservationController.foundOneReservacion({
      id: idReservacion,
    });

    if (!reservacionEliminar) {
      log.info(
        `La reservacion con id [${idReservacion}] no existe en la base de datos`
      );
      throw new ReservacionNoExiste();
    }

    let reservacionBorrada = await reservationController.deleteReservation(
      idReservacion
    );
    log.info(
      `La reservacion con [${idReservacion}] ha sido cancelada con exito`
    );
    roomController.updateAvailability(idRoom, disp).then(setearDisp => {
      log.info(`La habitacion con [${idRoom}] pasa a estar disponible`)
      res.json(reservacionBorrada);
      hotelController.deleteSolicitud(idHotel).then(desincHotel => {
        log.info(`La solicitud a bajado del hotel [${idHotel}]`)
      })
    }).catch(err => log.error(err))
  })
);

module.exports = reservationRouter;
