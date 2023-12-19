const { celebrate } = require('celebrate');
const { postMovieJoi, delMovieJoi } = require('../utils/constans');

const router = require('express').Router();
const { addMovie, delMovie, getMovies } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate(postMovieJoi), addMovie);
router.delete('/:movieId', celebrate(delMovieJoi), delMovie);

module.exports = router;
