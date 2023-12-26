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
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    description: 'Sample description',
    numReviews: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

export const productController = {
  getProducts,
  getProductById,
  createProduct,
};
