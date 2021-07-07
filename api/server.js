const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const db = require('../database/dbConfig')
const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session({
	resave: false, // avoid recreating sessions that have not changed
	saveUninitialized: false, // to comply with GDPR laws
	secret: "keep it secret, keep it safe", // cryptographically sign the cookie
	store: new KnexSessionStore({
		knex: db, // configured instance of knex
		createtable: true, // if the sessions table doesn't exist, create it automatically
	}),
}))

const authenticate = require('../database/auth/authenticate-middleware.js');
const authRouter = require('../database/auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');



server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

module.exports = server;
