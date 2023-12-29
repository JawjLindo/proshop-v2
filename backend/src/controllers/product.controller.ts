import { Types } from 'mongoose';
import { Middleware } from '../middleware';
import { Models } from '../models';
import { IReview } from '../models/review.model';
import { Product } from '../models/product.model';

const getProducts = Middleware.asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: { $regex: req.query.keyword, $options: 'i' },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Models.Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

const createProductReview = Middleware.asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Models.Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews?.find(
      (review) => review.user.toString() === req.user?._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user?.name!,
      rating: Number(rating),
      comment,
      user: req.user?.id,
    };

    product.reviews ? product.reviews?.push(review as IReview) : [review];

    product.numReviews = product.reviews!.length;

    product.rating =
      product.reviews!.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews!.length;

    await product.save();

    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const getTopProducts = Middleware.asyncHandler(async (req, res) => {
  const products = await Models.Product.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(products);
});

export const productController = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
