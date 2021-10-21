const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const auth = require('./middlewares/auth');
const { NotFoundError, centralError } = require('./middlewares/error');
require('dotenv').config();

const {
  PORT = 3000, BASE_PATH, NODE_ENV, BD_NAME_ON_SERVER,
} = process.env;
const BD_NAME = NODE_ENV === 'production' ? BD_NAME_ON_SERVER : 'bitfilmsdb';

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});
const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(`mongodb://localhost:27017/${BD_NAME}`, {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.use(limiter);
const allowlist = ['https://diplom.nomoredomains.monster/api', 'http://diplom.nomoredomains.monster/api', 'http://localhost:3000'];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
app.use(cors(corsOptionsDelegate));
app.options(corsOptionsDelegate, cors());

app.use(require('./routes/sign'));

app.use(auth);
app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundError('Такой страницы нет'));
});
app.use(errorLogger);
app.use(errors());
app.use(centralError);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
