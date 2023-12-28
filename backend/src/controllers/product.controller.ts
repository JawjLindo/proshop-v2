import { Types } from 'mongoose';
import { Middleware } from '../middleware';
import { Models } from '../models';

const getProducts = Middleware.asyncHandler(async (_req, res) => {
  const products = await Models.Product.find({});
  res.json(products);
});

const getProductById = Middleware.asyncHandler(async (req, res) => {
  const productId = new Types.ObjectId(req.params.id);
  const product = await Models.Product.findById(productId);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const createProduct = Middleware.asyncHandler(async (req, res) => {
  const product = new Models.Product({
    name: 'Sample name',
    price: 0,
    user: req.user?._id,
    image: 'sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    description: 'Sample description',
    numReviews: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = Middleware.asyncHandler(async (req, res) => {
  try {
    const { name, price, description, image, brand, category, countInStock } =
      req.body;
    const product = await Models.Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    console.log(error);
  }
});

const deleteProduct = Middleware.asyncHandler(async (req, res) => {
  const product = await Models.Product.findById(req.params.id);

  if (product) {
    await Models.Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'Product deleted' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export const productController = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
