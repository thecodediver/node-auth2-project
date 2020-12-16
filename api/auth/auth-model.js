const db = require("../../database/dbConfig")

// Functions
async function addUser(user) {
  const [id] = await db("users").insert(user)
  return db("users").where("id", id)
}

function findBy(filter) {
  return db("users").where(filter).orderBy("id")
}

module.exports = {
  addUser,
  findBy,
}