const Hotel = require("./hoteles.model");

function foundHotel() {
  return Hotel.find({}).populate('user').populate('room').populate('event').populate('admin').populate('reservation');
}

function createHotel(hotel, idAdmin) {
  return new Hotel({
    ...hotel,
    solicitud: 0,
    admin: idAdmin,
  }).save();
}

function searchHotel(search) {
  return Hotel.find({ $or: [{ name: search }, { direccion: search }] });
}

function deleteHotel(id) {
  return Hotel.findByIdAndRemove(id);
}

function updateHotel(id, hotel) {
  return Hotel.findOneAndUpdate({ _id: id }, { ...hotel }, { new: true });
}

function setReservation(id, idReservation) {
  return Hotel.findOneAndUpdate(
    { _id: id },
    { $push: { reservation: idReservation } },
    { new: true }
  );
}

function setSolicitud(id) {
  return Hotel.findOneAndUpdate(
    { _id: id },
    { $inc: { solicitud: 1 } },
    { new: true }
  );
}

function deleteSolicitud(id) {
  return Hotel.findOneAndUpdate(
    { _id: id },
    { $inc: { solicitud: -1 } },
    { new: true }
  );
}

function setRoom(id, idRoom) {
  return Hotel.findOneAndUpdate(
    { _id: id },
    { $push: { room: idRoom } },
    { new: true }
  );
}

function setEvent(id, idEvent) {
  return Hotel.findOneAndUpdate(
    { _id: id },
    { $push: { event: idEvent } },
    { new: true }
  );
}

function setUser(id, idUser) {
  return Hotel.findOneAndUpdate(
    { _id: id },
    { $push: { user: idUser } },
    { new: true }
  );
}

function setService(id, idService){
  return Hotel.findOneAndUpdate({_id: id}, {$push: {service: idService}}, {new: true})
}

function foundOneHotel({ id: id, name: name }) {
  if (name) {
    return Hotel.findOne({ name: name }).populate('user').populate('room').populate('event').populate('admin').populate('reservation').populate('service');
  }
  if (id) {
    return Hotel.findById(id).populate('user').populate('room').populate('event').populate('admin').populate('reservation').populate('service');
  }
  throw new Error(
    "Funcion obtener hotel del controlador fue llamado sin especificar el nombre o el id"
  );
}

module.exports = {
  foundHotel,
  createHotel,
  searchHotel,
  deleteHotel,
  updateHotel,
  setReservation,
  setRoom,
  setEvent,
  setUser,
  foundOneHotel,
  setSolicitud,
  setService,
  deleteSolicitud
};
