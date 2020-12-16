/* eslint-disable no-console */
const router = require('express').Router();
const { join } = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const { readFile } = require('fs');
const { getNotes } = require('./database/queries/getNote');
const { addNote } = require('./database/queries/addNote');
const { getUser } = require('./database/queries/getUser');
const { addUser } = require('./database/queries/addUser');
const { getHashedPassword } = require('./database/queries/getHashedPassword');

const { SECRET_KEY } = process.env;
const jwtString = (payload, SECRET_KEY) => new Promise((resolve, reject) => {
  jwt.sign(payload, SECRET_KEY, (err, token) => {
    if (err) return reject(err);
    return resolve(token);
  });
});
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
/* router.get('/note', (req, res, next) => {
  res.send(readFile(join(__dirname, '..', '..', 'public', 'main.html')));
}); */
const varifyToken = (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ msg: 'No authorize' });
    } else {
      req.userID = decoded.userID;
      next();
    }
  });
};

router.post('/notes', varifyToken, (req, res, next) => {
  addNote(req.body.header, req.body.content, req.userID)
    .then(() => res.redirect('/main.html')).catch(next);
});

// login route

router.post('/login', (req, res, next) => {
  let userID;
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
        userID = resData.rows[0].id;
        return getHashedPassword(resData.rows[0].email);
      }
    }).then((resUserPassword) => bcrypt.compare(password, resUserPassword.rows[0].password))
      .then((success) => {
        if (!success) {
          throw new Error('bad request');
        }
        return jwtString({ userID }, process.env.SECRET_KEY);
      })
      .then((token) => {
        res.cookie('token', token, { httpOnly: true }).redirect('/main.html');
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
    bcrypt.hash(password, 10).then((hashedPass) => {
      addUser(name, email, hashedPass, bio)
        .then((newUserData) => newUserData.rows[0])
        .then((userData) => {
          const { id } = userData;
          return jwtString({ userID: id }, SECRET_KEY);
        }).then((token) => {
          res.cookie('token', token, { httpOnly: true }).redirect('/main.html');
        });
    });

    // redirect to notes page
  } else {
    res.json({ msg: 'invalid information!!' });
  }
});

// logout route
router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect('/');
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
