const db = require("../database/dbConfig.js")

function findById(id) {
	return db("users")
		.select("id", "username")
		.where({ id })
		.first()
}

async function add(user) {
	const [id] = await db("users").insert(user)
	return findById(id)
}

function findBy(filter) {
	return db("users")
		.select("id", "username", "password")
		.where(filter)
}

module.exports = {
  findById,
  add,
  findBy,
}
