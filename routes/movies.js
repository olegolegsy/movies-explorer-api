const router = require('express').Router();
const { addMovie, delMovie, getMovies } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', addMovie);
router.delete('/:movieId', delMovie);

module.exports = router;
