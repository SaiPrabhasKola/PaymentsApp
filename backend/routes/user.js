const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const z = require('zod');
const { UserModel } = require('../db');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware');


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
        if (!username || !password) {
            console.log("creds unavailable")
            return res.json({
                message: "please provide the creds"
            })
        }

        const User = await UserModel.findOne({
            username
        })
        console.log(User)
        console.log(User._id)

        if (!User) {
            return res.status(411).json({
                message: "user doesn't exist"
            })
        }
        const checkPassword = User.password
        console.log(checkPassword)

        if (!password) { }
        const passCheck = bcrypt.compare(password, checkPassword)
        if (!passCheck) {
            res.status(411).json({
                message: "invalid creds"
            })
        }
        const payLoad = {
            userId: User._id
        }
        const token = jwt.sign(payLoad, process.env.JWT_SECRET)

        console.log(token)
        console.log('handle reached here')
        res.json({
            message: `hey ${User.username} you are signed up!!`,
            token: token
        })
    } catch (error) {
        res.json(error)
    }

})



const editBody = z.object({

    currentPassword: z.string(),
    newPassword: z.string().min(6).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
})



router.put('/edit', authMiddleware, async (req, res) => {
    try {
        const result = editBody.safeParse(req.body)
        if (result.success) {
            console.log('success parsing the data')
        }
        if (!result.success) {
            res.status(400).json({
                message: "error while updating the info"
            })
        }
        const { currentPassword, newPassword, firstName, lastName } = result.data
        console.log(result)
        const User = await UserModel.findById(req.userId)
        console.log(`user available ${User.username}`)
        const passCheck = await bcrypt.compare(currentPassword, User.password)

        if (!passCheck) {
            return res.json({
                message: "invalid password"
            })
        }

        console.log('password is correct')
        const payLoad = {};
        if (firstName !== undefined) {
            payLoad.firstName = firstName
        }
        if (lastName !== undefined) {
            payLoad.lastName = lastName
        }
        if (newPassword) {
            const newPasswordHash = await bcrypt.hash(newPassword, 10)
            payLoad.password = newPasswordHash
        }

        await UserModel.updateOne({ _id: req.userId }, { $set: payLoad })
        res.json({
            message: "We've updated your profile"
        })
    } catch (error) {
        res.status(404).json({ error })
    }
})





router.get('/users-data', authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await UserModel.find({
        $or: [{
            firstName: {
                "$regex": filter,
                "$options": "i"
            }
        }, {
            lastName: {
                "$regex": filter,
                "$options": "i"
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })


})



module.exports = router