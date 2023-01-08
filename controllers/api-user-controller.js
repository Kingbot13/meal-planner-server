const User = require("../models/user");

// get user details
exports.userGet = (req, res, next) => {
  User.findById(req.params.userId)
    .populate("recipes")
    .exec((err, user) => {
      if (err) return next(err);
      return res.status(200).json(user);
    });
};
