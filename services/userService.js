const {User} = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const {msg} = require('../config/constants');
// const bcrypt = require('bcrypt');

async function register(data) {

    const {username} = data;

    // let user = await User.findOne({username});
    // if (user) throw {message: 'Username is in use'};
    //
    // user = new User(data);
    // return user.save();

    await User.findOne({username})
        .then((user) => {
            if (user) {
                throw {message: msg.USERNAME_IS_IN_USE(username)}
            }
            return new User(data).save();
        });
}

function login(data) {
    const {username, password} = data;

    // let user = await User.findOne({username}) || {};
    // let isMatch = await bcrypt.compare(password, user.password || '');
    //
    // if (!user || !isMatch) {
    //     throw {message: 'Wrong username and/or password'}
    // }
    // return jwt.sign({id: user._id, username: user.username}, config.secret, {expiresIn: "1h"});

    // return User.findOne({username})
    //     .then((user) => {
    //         if (bcrypt.compareSync(password, user.password || '')) {
    //             return jwt.sign({id: user._id, username: user.username}, config.secret, {expiresIn: "60s"});
    //         } else {
    //             return '';
    //         }
    //     });

    return User.findOne({username})
        .then((user) => {
            if (user) {
                return Promise.all([user.comparePasswords(password), user])
            }
            return [false];
        }).then(([isMatch, user]) => {
            if (isMatch) {
                return jwt.sign({id: user._id, username: user.username}, config.privateKey, {expiresIn: "1h"});
            } else {
                return '';
            }
        });
}

module.exports = {
    register,
    login
}
