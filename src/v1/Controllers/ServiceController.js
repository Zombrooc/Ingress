const Services = require("../Models/Services");
const User = require("../Models/User");

module.exports = {
  async store(req, res) {
    const authenticatedUser = await User.findById(req.userID).select(
      "+isAdmin"
    );

    if (!authenticatedUser.isAdmin) {
      return res.status(401).send({
        status: 401,
        message: "Usuário não autorizado",
      });
    }

    try {
      const newService = await Services.create(req.body);

      return res.send(newService);
    } catch (err) {
      return res.send(err.message);
    }
  },
  async index(req, res) {
    const allServices = await Services.find();

    return res.send(allServices);
  },
  async update(req, res) {
    const authenticatedUser = await User.findById(req.userID).select(
      "+isAdmin"
    );

    if (!authenticatedUser.isAdmin) {
      return res.status(401).send({
        status: 401,
        message: "Usuário não autorizado",
      });
    }

    try{
      const updatedService = await Services.findByIdAndUpdate(req.params.serviceId, {
        $set: {
          ...req.body,
          updatedAt: new Date(),
        },
      });

      return res.send(updatedService);
    }catch(error){
      return res.send(error);
    }

  },
  async show(req, res) {
    const { serviceId } = req.params;

    const serviceDetails = await Services.findById(serviceId);

    return res.send(serviceDetails);
  },
  async delete(req, res) {
    const { serviceId } = req.params;

    const authenticatedUser = await User.findById(req.userID).select('+isAdmin');

    if (!authenticatedUser.isAdmin) {
      return res.status(401).send({
        status: 401,
        message: "Usuário não autorizado",
      });
    }

    const service = await Services.findById(serviceId);

    if (!service) {
      return res.send({
        error:
          "Nenhum serviço encontrado com esse ID, talvez ele já tenha sido excluido",
      });
    }

    await service.deleteOne();

    return res.send({
      done: "Serviço excluido com sucesso",
    });
  },
};
