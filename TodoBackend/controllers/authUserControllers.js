const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findAuthUser } = require('../models/authModel');
const { validateEmailPassword } = require('../utils/utils');

async function loginAuth(req, res) {
    const secret = process.env.SECRET_KEY
    const { email, password } = req.body

    const { error } = validateEmailPassword(req.body);
    if (error) {
        return res.status(404).send(error.details.map(x => x.message).join(', '))
    }

    try {
        const user = await findAuthUser(email)
        if (!user) {
            res.status(400).send({ message: 'Login is incorrect' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).send({ message: 'Password is incorrect' })
        }

        const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '12d' })
        console.log(token);
        res.status(200).send(JSON.stringify(token));
    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    loginAuth
}

// 1. Find User by username
// 2. if it exists, compare password with database
// 3. if comparison is successfull, access granted and generate jwt