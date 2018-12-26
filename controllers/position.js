const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

const getByCategoryId = async (req, res) => {
  try {
    const positions = await Position.find({
      category: req.params.categoryId,
      user: req.user.id
    })
    res.status(200).json(positions)
  } catch (e) {
    errorHandler(res, e)
  }
}

const create = async (req, res) => {
  try {
    const position = await new Position({
      name: req.body.name,
      cost: req.body.cost,
      category: req.body.category,
      user: req.user.id
    }).save()
    res.status(201).json(position)
  } catch (e) {
    errorHandler(res, e)
  }
}

const update = async (req, res) => {
  try {
    const position = await Position.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    )
    res.status(200).json(position)
  } catch (e) {
    errorHandler(res, e)
  }
}

const remove = async (req, res) => {
  try {
    await Position.delete({_id: req.params.id})
    res.status(200).json({
      message: 'Position removed success'
    })
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports = {
  getByCategoryId,
  create,
  update,
  remove
}
