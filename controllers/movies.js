const { ForbiddenError, NotFoundError, BadRequestError } = require('../middlewares/error');
const Movie = require('../models/movie');

module.exports.getmovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deletemovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findOne({ movieId: id })
    .orFail(new NotFoundError('Такого фильма нет в избранном'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Данного фильма нет в избранном. Удалить её нельзя');
      } else {
        movie.remove().then(() => res.send({ message: movie }));
      }
    }).catch(next);
};

module.exports.createmovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.send({
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailer: movie.trailer,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
        thumbnail: movie.thumbnail,
        movieId: movie.movieId,
        owner: movie.owner,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};
