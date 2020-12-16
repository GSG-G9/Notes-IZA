/* eslint-disable no-console */
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { getNotes } = require('./database/queries/getNote');
const { addNote } = require('./database/queries/addNote');
const { getUser } = require('./database/queries/getUser');
const { addUser } = require('./database/queries/addUser');
const { getHashedPassword } = require('./database/queries/getHashedPassword');

// get notes for each user
router.get('/notes/:userID', (req, res, next) => {
  getNotes(req.params.userID)
    .then((results) => res.json({
      data: results.rows,
      status: 200,
      msg: 'success',
    }))
    .catch(next);
});
module.exports = router;

// add note
router.post('/addNote/:userID', (req, res, next) => {
  console.log(req.body);
  addNote(req.body.header, req.body.content, req.params.userID)
    .then(({ rows }) => res.status(200).json({
      data: rows,
      msg: 'success',
      status: 200,
    })).catch(next);
});

// login route
const { SECRET_KEY } = process.env;
const jwtString = (payload, SECRET_KEY) => new Promise((resolve, reject) => {
  jwt.sign(payload, SECRET_KEY, (err, token) => {
    if (err) return reject(err);
    return resolve(token);
  });
});
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).required(),
  });
  const result = schema.validate({ email, password });
  if (result.error === undefined) {
    getUser(email).then((resData) => {
      if (resData.rowCount === 0) {
        throw new Error('email not found');
      } else {
        return getHashedPassword(resData.rows[0].email);
      }
    }).then((resUserPassword) => bcrypt.compare(password, resUserPassword.rows[0].password))
      .then((success) => {
        if (!success) {
          throw new Error('bad request');
        }
        return jwtString({ email }, process.env.SECRET_KEY);
      })
      .then((token) => {
        res.cookie('token', token, { httpOnly: true });
        res.json({ msg: 'login success ' });
      })
      .catch(next);
  } else {
    res.json({ msg: 'invalid information' });
  }
});

router.post('/sign-up', (req, res) => {
  const {
    name, email, password, confirmedPassword, bio,
  } = req.body;
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).required(),
    confirmedPassword: Joi.ref('password'),
    bio: Joi.string().required(),
  });
  const result = schema.validate({
    name, email, password, confirmedPassword, bio,
  });
  if (result.error === undefined) {
    addUser(name, email, password, confirmedPassword, bio)
      .then((newUserData) => newUserData.rows[0])
      .then((userData) => {
        const { id, name, bio } = userData;
        return jwtString({ id, name, bio }, SECRET_KEY);
      }).then((token) => {
        res.cookie('signedUp', token, { httpOnly: true });
        res.json({ msg: 'sign up success ' });
      });
    // redirect to notes page
  } else {
    res.json({ msg: 'invalid information!!' });
  }
});

// error handling
router.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: err.status || 500,
    msg: err.msg || 'Internal Server Error',
    data: null,
  });
});
