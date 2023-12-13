const User = require('../models/User');
const Comment = require('../models/Comment')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  createJWT,
} = require("../utils/auth");
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.comments = (req, res, next) => {
  let { comment, email, transaction } = req.body;
  let errors = [];
  if (!comment) {
    errors.push({ comment: "required" });
  }
  if (!email) {
    errors.push({ name: "required" })
  }
  if (!transaction) {
    errors.push({ transaction: "required" })
  }
  const userComment = new Comment({
    comment: comment,
    email: email,
    transaction: transaction,
  });
  userComment.save()
    .then(response => {
      res.status(200).json({
        success: true,
        result: response
      })
    })
    .catch(err => {
      res.status(500).json({
        errors: [{ error: err }]
      });
    });

}

exports.getAllComments = (req, res, next) => {
  const transactionId = req.params.transactionId;
  // res.setHeader('Access-Control-Allow-Origin', 'https://bitcoin-explorer-tusharpasricha.vercel.app');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  Comment.find({ transaction: transactionId })
    .then(comments => {
      res.status(200).json({
        success: true,
        comments: comments
      });
    })
    .catch(err => {
      res.status(500).json({
        errors: [{ error: err }]
      });
    });
};


exports.signup = (req, res, next) => {
  let { name, email, password, password_confirmation } = req.body;
  let errors = [];
  if (!name) {
    errors.push({ name: "required" });
  }
  if (!email) {
    errors.push({ email: "required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ email: "invalid" });
  }
  if (!password) {
    errors.push({ password: "required" });
  }
  if (!password_confirmation) {
    errors.push({
      password_confirmation: "required",
    });
  }
  if (password != password_confirmation) {
    errors.push({ password: "mismatch" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return res.status(422).json({ errors: [{ user: "email already exists" }] });
      } else {
        const user = new User({
          name: name,
          email: email,
          password: password,
        });
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) throw err;
            user.password = hash;
            user.save()
              .then(response => {
                res.status(200).json({
                  success: true,
                  result: response
                })
              })
              .catch(err => {
                res.status(500).json({
                  errors: [{ error: err }]
                });
              });
          });
        });
      }
    }).catch(err => {
      res.status(500).json({
        errors: [{ error: 'Something went wrong' }]
      });
    })
}
exports.signin = (req, res) => {
  let { email, password } = req.body;
  let errors = [];
  if (!email) {
    errors.push({ email: "required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ email: "invalid email" });
  }
  if (!password) {
    errors.push({ password: "required" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  User.findOne({ email: email }).then(user => {
    if (!user) {
      return res.status(404).json({
        errors: [{ user: "not found" }],
      });
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return res.status(400).json({
            errors: [{
              password:
                "incorrect"
            }]
          });
        }
        let access_token = createJWT(
          user.email,
          user._id,
          3600
        );
        jwt.verify(access_token, process.env.TOKEN_SECRET, (err,
          decoded) => {
          if (err) {
            return res.status(500).json({ erros: err });
          }
          if (decoded) {
            return res.status(200).json({
              success: true,
              token: access_token,
              message: user
            });
          }
        });
      }).catch(err => {
        return res.status(500).json({ erros: err });
      });
    }
  }).catch(err => {
    return res.status(500).json({ erros: err });
  });
}