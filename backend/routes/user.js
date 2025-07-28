const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const z = require('zod');
const { UserModel } = require('../db');
const jwt = require('jsonwebtoken')
const signupBody = z.object({
    username: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
})

router.post('/signup', async (req, res) => {
    try {
        const { success } = signupBody.safeParse(req.body)
        if (!success) {
            return res.status(411).json({
                message: "please follow the data rules"
            })
        }

        const existingUser = await UserModel.findOne({
            username: req.body.username
        })
        console.log('usercheck')
        if (existingUser) {
            return res.json({
                message: "user already exists"
            })
        }
        const password = req.body.password
        const hashedPassword = await bcrypt.hash(password, 11)
        const user = await UserModel.create({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })
        res.json({
            message: `user created..Hey ${req.body.username}`
        })

    } catch (error) {
        res.json(error)
    }

})

router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body

        const User = await UserModel.findOne({
            username
        })
        console.log(User)
        if (!User) {
            return res.status(411).json({
                message: "user doesn't exist"
            })
        }
        const checkPassword = User.password
        console.log(checkPassword)

        const passCheck = bcrypt.compare(password, checkPassword)
        if (!passCheck) {
            res.status(411).json({
                message: "invalid creds"
            })
        }
        const token = jwt.sign(username, process.env.JWT_SECRET)
        console.log(token)
        res.json({
            message: `hey ${User.username} you are signed up!!`
        })
    } catch (error) {

    }

})


module.exports = router