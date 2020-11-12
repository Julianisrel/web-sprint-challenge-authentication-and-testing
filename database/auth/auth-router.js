const router = require('express').Router();
const Users = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
//current
router.post("/register", async (req, res, next) => {
  try {
  		const { username, password } = req.body
  		const user = await Users.findById({ username }).first()
  		if (user) {
  			return res.status(409).json({
  				message: "Username is already taken",
  			})
  		}
  		const newUser = await Users.add({
  			username,
  			// hash the password with a time complexity of "14"
  			password: await bcrypt.hash(password, 14),
  		})

      const token = jwt.sign({
  			userID: newUser.id,
  		}, 'a-plus')
  		// send the token back as a cookie
  		req.session.token = token

  		res.status(201).json(newUser)
  	} catch(err) {
  		next(err)
  	}
})

router.post("/login", async (req, res, next) => {
  try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()
		if (!user) {
			return res.status(401).json({
				message: "'You shall not pass!",
			})
		}
		// compare the plain text password from the request body to the
		// hash we have stored in the database. returns true/false.
		const passwordValid = await bcrypt.compare(password, user.password)
		// check if hash of request body password matches the hash we already have
		if (!passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}
		// create a new session for the user
		// req.session.user = user
    //req.session.signedIn = true
    const token = jwt.sign({
			userID: user.id,
		}, 'a-plus')
		// send the token back as a cookie
		req.session.token = token

		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})

module.exports = router;
