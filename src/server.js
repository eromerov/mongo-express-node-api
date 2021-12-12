import chalk from 'chalk';
import express from 'express';
import dotenv from 'dotenv';
import helpmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

//error handler
import errorHandler from './middleware/error.js'

//database
import db from '../config/db.js';

//routes
import auth from './routes/auth.js';
import contacts from './routes/contacts.js';
import users from './routes/users.js';

//rate-limit
import limiter from './middleware/rateLimiter';

dotenv.config({ path: './config/.env' }); //load .env variables
db.connect();

const prefix = '[server-api]'
const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev')); // middleware
}

app.use(limiter);

app.use(express.json()); //use express.json() than the bodyParser.json()

app.use(mongoSanitize()); //mongo sanitize

app.use(helpmet()); //HTTP headers security,

app.use(hpp()); //param pollution



//apis
app.use('/api/v1/auth', auth);
app.use('/api/v1/contacts', contacts);
app.use('/api/v1/users', users);

app.use(errorHandler);


//server
app.listen(
  PORT,
  console.log(`${prefix} running in ${chalk.yellow(process.env.NODE_ENV)} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {

  console.log(chalk.red(`${prefix} error ${err.message}`))
  //server.close(() => process.exit(1)); // close server & exit process

});