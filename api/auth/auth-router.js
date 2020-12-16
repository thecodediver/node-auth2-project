const router = require("express").Router()
const bcrypt = require("bcryptjs")
const Auth = require("./auth-model")

const checkPayload = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json("bad payload")
  } else {
    next()
  }
}
const checkUsernameUnique = async (req, res, next) => {
  // username must not be in the db already
  try {
    const rows = await Auth.findBy({ username: req.body.username })
    if (!rows.length) {
      next()
    } else {
      res.status(401).json("username taken")
    }
  } catch (err) {
    res.status(500).json("something failed tragically")
  }
}
const checkUsernameExists = async (req, res, next) => {
  // username must be in the db already
  // we should also tack the user in db to the req object for convenience
  try {
    const rows = await Auth.findBy({ username: req.body.username })
    if (rows.length) {
      // eslint-disable-next-line prefer-destructuring
      req.userData = rows[0]
      next()
    } else {
      res.status(401).json("who is that exactly?")
    }
  } catch (err) {
    res.status(500).json("something failed tragically")
  }
}

router.post("/register", checkPayload, checkUsernameUnique, async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10)
    const newUser = await Auth.addUser({ username: req.body.username, password: hash })
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json("I spilt")
  }
})

router.post("/login", checkPayload, checkUsernameExists, (req, res) => {
  try {
    const verified = bcrypt.compareSync(req.body.password, req.userData.password)
    if (verified) {
      req.session = req.userData
      res.json(`Welcome back, ${req.userData.username}`)
    } else {
      res.status(401).json("Bad credentials")
    }
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.json("You can not leave")
      } else {
        res.json("Goodbye")
      }
    })
  } else {
    res.json("there was no session")
  }
})

module.exports = router