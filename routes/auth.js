const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation} = require('../validation');


router.post('/register', async (req, res) => {

  // VALIDATE DATA
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // CHECK if the user already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email alreay exists');

  // HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // NEW USER
  const user = new User({
    login: req.body.login,
    password: hashedPassword,
    email: req.body.email,
  });

  try {
    const savedUser = await user.save();
    res.status(200).send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  // LOGIN VALIDATION
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // CHECK by email if the user already in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email was not found');

  //PASSWORD IS CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Password is not valid');

  // CREATE TOKEN
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

module.exports = router;