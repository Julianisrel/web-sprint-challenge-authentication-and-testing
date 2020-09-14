const router = require('express').Router();
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const
router.post('/register', async (req, res, next) => {
  try {
    const newUser = await Users.add({
    			username: req.body.username,
    			// hash the password with a time complexity of "14"
    			password: await bcrypt.hash(req.body.password, 14),
    		})
    		res.status(201).json(newUser)
  	} catch(err) {
  		next(err)
  	}
});

router.post("/login", async (req, res, next) => {
  console.log('test')
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
    const token = jwt.sign({
			userID: user.id,
		}, 'a-plus')

		// send the token back as a cookie
		res.cookie("token", token)
    console.log('token: ', token)
		res.json({
			message: `Welcome ${user.username}!`,
		})
    //var decoded = jwt.verify(token, 'shhhhh');
		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})

module.exports = router;
