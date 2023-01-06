const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// handle new user registration
exports.signUpPost = [
    body('username', 'Username must not be empty')
    .trim()
    .isLength({min: 1})
    .escape(),
    body('password', 'Password must not be empty')
    .trim()
    .isLength({min: 1})
    .escape(),
    body('firstName').escape(),
    body('lastName').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        bcrypt.hash(req.body.password, 8, (err, hash) => {
            const user = new User({
              username: req.body.username,
              password: hash,
              firstName: req.body.firstName ?? null,
              lastName: req.body.lastName ?? null,
              isAdmin: false,
            });
            if (err) {
              return next(err);
            }
            if (!errors.isEmpty()) {
              return res
                .status(400)
                .json({ message: "error registering user", user: user });
            }
            // successful
            user.save((err) => {
              if (err) {
                return next(err);
              }
            });
            return res.status(200).json({ user });
          });
    }
];

// handle log in
exports.logInPost = (req, res, next) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err || !user) return res.status(400).json({message: "error logging in user", user: user});
    req.login(user, {session: false}, (err) => {
      if (err) res.send(err);
      // generate signed token with user obj and return token
      const token = jwt.sign(user.toJSON(), process.env.SECRET_KEY);
      return res.status(200).json({user, token});
    })
  }), (req, res);
}