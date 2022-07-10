const { Thought, User } = require('../models')

const thoughtController = {
    getAllThoughts (req, res)
    {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err =>
            {
                console.log(err);
                res.status(400).json(err)
            })
    },
    getThoughtById ({ params }, res)
    {
        Thought.findOne({ _id: params.id })
            .then(dbThoughtData =>
            {
                if (!dbThoughtData)
                {
                    res.status(404).json({ message: 'No thought with this id!'})
                    return
                }
                res.json(dbThoughtData)
            })
            .catch(err =>
            {
                console.log(err)
                res.status(400).json(err)
            })
    },
    createThought ({ body }, res)
    {
        Thought.create(body)
            .then(thoughtData =>
            {
                return User.findByIdAndUpdate(
                    { _id: body.userId },
                    { $pull: { thoughts: thoughtData._id } },
                    { new: true }
                )
            })
            .then(dbUserData =>
            {
                if(!dbUserData)
                {
                    res.ststus(404).json({ message: 'No user found with this ID!'})
                    return
                }
                res.json(dbUserData)
            })
            .catch(err => res.json(err))
    },
    updateThought ({ params, body }, res) 
    {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbThoughtData => 
            {
                if (!dbThoughtData) 
                {
                    res.status(404).json({ message: "No thought with this ID" })
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.status(400).json(err))
    },
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({
            _id: params.id
        })
            .then(dbThoughtData => 
            {
                if (!dbThoughtData) 
                {
                    res.status(404).json({ message: "No thought with this ID" })
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err))
    },
    addReaction ({ params, body }, res)
    {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true }
        )
            .then(dbThoughtData =>
            {
                if (!dbThoughtData) 
                {
                    res.status(404).json({ message: "No thought with this id" });
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.json(err))
    },
    deleteReaction ({ params }, res) 
    {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err))
    }
}

module.exports = thoughtController