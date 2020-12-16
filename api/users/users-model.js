const db = require("../../database/dbConfig")

function find() {
  return db("users").select("id", "username").orderBy("id")
}

module.exports = {
  find,
}