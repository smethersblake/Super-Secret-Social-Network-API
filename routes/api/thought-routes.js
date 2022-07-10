const router = require('express').Router()

const {getAllThoughts, getThoughtById, createThought, updateThoughtById, deleteThought, addReaction, deleteReaction } = require('../../controllers/thought-controller')

router.route('/').get(getAllThoughts).post(createThought)

router.route('/:id').get(getThoughtById).put(updateThoughtById).delete(deleteThought)

router.route('/:thoughtId/reactions').post(addReaction).delete(deleteReaction)

module.exports = router