const router = require('express').Router();

const { validMoviepost, validMoviedelete } = require('../middlewares/validator');
const { getmovies, createmovie, deletemovie } = require('../controllers/movies');

router.get('/api/movies', getmovies);
router.post('/api/movies', validMoviepost, createmovie);
router.delete('/api/movies/:id', validMoviedelete, deletemovie);

module.exports = router;
