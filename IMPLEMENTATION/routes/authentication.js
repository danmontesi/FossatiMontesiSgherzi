const express = require('express');
const authRouter = express.Router();

authRouter.get('/', (req, res, next) => {
    res.send(JSON.stringify({
          status: 200,
          message: "Hit /auth/",
    }));
})

authRouter.get('/user', (req, res, next) => {
    res.send(JSON.stringify({
          status: 200,
          message: "Hit /auth/user",
    }));
})

module.exports = authRouter

