const router = require("express").Router()
const User = require("./users-model")

const restricted = (req, res, next) => {
  if (req.session && req.session.user) {
    next()
  } else {
    res.status(401).json("Unauthorized")
  }
}

router.get("/", restricted, (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json({ id: req.session.user, allUsers: users })
    })
    .catch((err) => res.send(err))
})

module.exports = router