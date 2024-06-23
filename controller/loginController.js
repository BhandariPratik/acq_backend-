const jwt = require('jsonwebtoken')
require('dotenv').config();
let db = require('../models/connection');
const authModel = db.auth;


const addUser = async (req, res) => {
    try {
        let reqbody = req.body
        let { email } = req.body

        const user = await authModel.findOne({ where: { 'email': email } });
        if (user) {
            res.status(200).json({ message: "Email is already Registered" });
        }
        else {
            let data = await authModel.create(reqbody)
            res.status(200).json({ data, message: "cretated User successfully" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const secretKey = process.env.SECRETKEY

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await authModel.findOne({ where: { 'email': email, 'password': password } });

        if (!user) {
            return res.status(404).json({ message: 'Email or Password is Wrong' });
        }

        const token = jwt.sign(
            { userId: user.id },
            secretKey,
            { expiresIn: '7h' }
        );

        res.status(200).json({ token, user, message: 'Login User successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const validateToken = (req, res, next) => {
    const token = req.header('token');
    const secretkey = process.env.SECRETKEY

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, secretkey);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = {
    login, validateToken, addUser
}