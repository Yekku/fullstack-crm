module.exports = (res, error) => {
  res.status(500).json({
    success: false,
    message: error.message ? error.message : error
  })
}

module.exports = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}