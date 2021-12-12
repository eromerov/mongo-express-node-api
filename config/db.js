import chalk from 'chalk';
import mongoose from 'mongoose';

// No More Deprecation Warning Options
// https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options

const db = {};
db.connect = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`[server-api] mongodb connected ${chalk.green('OK')}`);
};

export default db;