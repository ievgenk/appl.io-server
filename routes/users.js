const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { PORT, JWT_SECRET, MONGODB_URI } = process.env;

router.use(express.json());

const UserModel = require("../models/userModel");

router.post("/signup", (req, res) => {
  let validEmail = validator.isEmail(req.body.email);

  if (!validEmail) {
    return res.status(500).json({
      message: "This is an Invalid Email"
    });
  }

  UserModel.findOne({
    email: req.body.email
  })
    .exec()
    .then(user => {
      if (user) {
        return res.status(409).json({
          message: "This email already exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            new UserModel({
              email: req.body.email,
              password: hash
            })
              .save()
              .then(newUser => {
                res.status(201).json({
                  message: "User Created"
                });
              })
              .catch(error => {
                res.status(500).send(error);
              });
          }
        });
      }
    });
});

router.post("/login", (req, res) => {
  UserModel.findOne({
    email: req.body.email
  })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth Failed"
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id
            },
            JWT_SECRET,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            token,
            user: user._id
          });
        }
        return res.status(401).json({
          message: "Auth Failed"
        });
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error);
    });
});

module.exports = router;
