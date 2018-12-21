const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

const login = async (req, res) => {
  const body = req.body
  const user = await User.findOne({ email: body.email })
  if (user) {
    const passwordCorrect = bcrypt.compareSync(body.password, user.password)
    if (passwordCorrect) {
      const token = jwt.sign({
        email: user.email,
        userId: user._id
      }, keys.jwt, { expiresIn: 60 * 60 })

      res.status(200).json({
        token: `bearer ${token}`
      })
    } else {
      res.status(401).json({
        message: 'password is incorrect'
      })
    } 
  } else {
    return res.status(404).json({ error: 'user not found' })
  }
  res.status(200).json({
    login: {
      email: req.body.email,
      password: req.body.password
    }
  })
}

const register = async (req, res) => {
    try {
      const body = req.body

      const condidate = await User.find({ email: body.email })
      if (condidate) {
        return res.status(409).json({ error: 'username must be unique' })
      } else {

        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
          email: body.email,
          password: bcrypt.hashSync(password, salt)
        })

        await user.save()
        res.status(201).json(user)
      }
    } catch (e) {
      errorHandler(res, e)
    }
}

  module.exports = {
    login,
    register
  }