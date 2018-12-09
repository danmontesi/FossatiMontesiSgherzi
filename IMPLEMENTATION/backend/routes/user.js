const express = require('express');
const userRouter = express.Router();


userRouter.get('/', (req, res, next) => {
    res.send(JSON.stringify({
          status: 200,
          message: "Hit /user/",
    }));
})

userRouter.get('/user', (req, res, next) => {
    res.send(JSON.stringify({
          status: 200,
          message: "Hit /user/user",
    }));
})

module.exports = userRouter
