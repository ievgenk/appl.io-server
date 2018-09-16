const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { PORT, JWT_SECRET, MONGODB_URI } = require("../config");

router.use(express.json());
//Auth
const { User, Board } = require("../models/userModel");

router.post("/signup", (req, res) => {
  let validEmail = validator.isEmail(req.body.email);
  let emptyPass = validator.isEmpty(req.body.password);
  let passLongEnough = validator.isLength(req.body.password, {
    min: 6,
    max: 15
  });

  if (!validEmail) {
    return res.status(500).json({
      message: "This is an Invalid Email"
    });
  } else if (emptyPass) {
    return res.status(500).json({
      message: "Password field is empty"
    });
  } else if (!passLongEnough) {
    return res.status(500).json({
      message: "Password needs to be between 6 and 15 characters"
    });
  }

  User.findOne({
    email: req.body.email
  })
    .exec()
    .then(user => {
      if (user) {
        return res.status(409).json({
          message: "This email already exists"
        });
      } else {
        bcrypt.hash(req.body.password.trim(), 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            new User({
              email: req.body.email,
              password: hash
            })
              .save()
              .then(newUser => {
                return Board.insertMany([
                  { title: "Applied", user: newUser._id },
                  { title: "Phone Screen", user: newUser._id },
                  { title: "Interview", user: newUser._id },
                  { title: "Rejected", user: newUser._id },
                  // Changed Offers
                  { title: "Offers", user: newUser._id }
                ]).then(result => {
                  return res.status(201).json({
                    message: "User Created"
                  });
                });
              })
              .catch(error => {
                console.log(error);
                res.status(500).send(error);
              });
          }
        });
      }
    });
});

router.post("/login", (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "User was not found"
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Incorrect Password"
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
          message: "Incorrect Password"
        });
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error);
    });
});

module.exports = router;
