const Product = require("../Models/Product");
const User = require("../Models/User");
const { FileUtils } = require("../services/fileUtils");

const routes = {
  async store(req, res, next) {
    if (!req.file) {
      return res.status(400).send({ error: "No file to be uploaded." });
    }

    const { discount } = req.body;
    const { userID } = req;

    const { originalname, buffer, mimeType } = req.file;

    const user = await User.findById(userID).select("+isAdmin");

    if (!user.isAdmin) {
      return res.status(401).send({ error: "Usuário não autorizado" });
    }

    const fileUtils = new FileUtils();
    const publicUrl = fileUtils.uploadFile(
      originalname,
      buffer,
      mimeType,
      next
    );

    const newProduct = await Product.create({
      ...req.body,
      discount: discount || 0,
      image: publicUrl,
    });

    return res.status(200).send(newProduct);
  },
  async index(req, res) {
    const products = await Product.find({}).sort("-createdAt");
    return res.send(products);
  },
  async show(req, res) {
    const { productID } = req.params;

    const productDetails = await Product.findById(productID);

    return res.send(productDetails);
  },
  async delete(req, res) {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.send({
        error:
          "Nenhum produto encontrado com esse ID, talvez ele já tenha sido excluido",
      });
    }

    const fileUtils = new FileUtils();
    const fileName = product.image.split("/")[4];
    await fileUtils.deleteFile(fileName);

    await product.deleteOne();

    return res.send({
      done: "Produto excluido com sucesso",
    });
  },
};

module.exports = routes;
