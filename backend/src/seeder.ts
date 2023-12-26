import dotenv from 'dotenv';
import 'colors';

import { users, products } from './data';

import { Models } from './models';

import { connectDb } from './config';

dotenv.config();
console.info(process.env.MONGO_URI);
connectDb();

const importData = async () => {
  try {
    await Models.Order.deleteMany();
    await Models.Product.deleteMany();
    await Models.User.deleteMany();

    const createdUsers = await Models.User.insertMany(users);

    const adminUser = createdUsers[0];

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Models.Product.insertMany(sampleProducts);

    console.info('Data Imported!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Models.Order.deleteMany();
    await Models.Product.deleteMany();
    await Models.User.deleteMany();

    console.info('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
