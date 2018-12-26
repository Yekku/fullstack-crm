const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

const login = async (req, res) => {
  const body = req.body
  const user = await User.findOne({email: req.body.email})
  if (user) {
    const passwordCorrect = bcrypt.compareSync(body.password, user.password)
    if (passwordCorrect) {
      const token = jwt.sign({
        email: user.email,
        userId: user._id
      }, keys.jwt, {expiresIn: 60 * 60})

      res.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      res.status(401).json({
        message: 'Password is incorrect'
      })
    }
  } else {
    res.status(404).json({
      message: 'User not found'
    })
  }
}

const register = async (req, res) => {
  const body = req.body
  const candidate = await User.find({email: body.email})
  if (candidate) {
    res.status(409).json({
      message: 'This email is reserved, try another one'
    })
  } else {
    const salt = bcrypt.genSaltSync(10)
    const password = body.password
    const user = new User({
      email: body.email,
      password: bcrypt.hashSync(password, salt)
    })
    try {
      await user.save()
      res.status(201).json(user)
    } catch(e) {
      errorHandler(res, e)
    }
  }
}

module.exports = {
  login,
  register
}
