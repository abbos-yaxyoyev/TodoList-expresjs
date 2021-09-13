const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUcerId, postCreatUcer } = require('../models/userModel');
const { postCreatUcer_id } = require('../models/TodoListModules')
const { validateUcer } = require('../utils/utils')

const secret = process.env.SECRET_KEY

async function createUser(req, res) {

    const { error } = validateUcer(req.body);
    if (error) {
        return res.status(404).send(error.details.map(x => x.message).join(', '))
    }

    const { name, lastName, email, password } = req.body

    try {
        const checkUser = await getUcerId(email);
        if (checkUser) {
            res.status(400).send({
                message: `email or password already exists`
            })
        } else {
            const hashedPassword = await bcrypt.hash(password, 12)
            const newUser = {
                name,
                lastName,
                email,
                password: hashedPassword,
            }
            const user = await postCreatUcer(newUser);
            console.log('user saved', user);
            if (user) {
                postCreatUcer_id(user._id);
            }
            console.log('token1');
            const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '12d' })
            console.log('tokenUser: ', token);

            res.status(200).send(JSON.stringify(token));
        }

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createUser
}