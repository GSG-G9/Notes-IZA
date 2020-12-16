const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { getNotes } = require('./database/queries/getNote');
const { addNote } = require('./database/queries/addNote');
const { getUser } = require('./database/queries/getUser');
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
router.post('/login', (req, res, next) => {
  console.log(req.body);

  const { email, password } = req.body;
  // const email = 'zeengen2002@gmail.com';
  // const password = '12345577';
  let hashedPassword = '';
  console.log(hashedPassword);
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).required(),
  });
  const result = schema.validate({ email, password });
  if (result.error === undefined) {
    getHashedPassword(email)
      .then((hashResult) => {
        hashedPassword = hashResult;
      }).then(() => bcrypt.genSalt(10))

      .then((salt) => {
        bcrypt.hash(password, salt)
          .then((hash) => {
            bcrypt.compare(hash, hashedPassword)
              .then((compareResult) => {
                console.log(compareResult);
                if (compareResult) {
                  getUser(email)
                    .then(({ rows }) => res.status(200).json({
                      data: rows,
                      msg: 'success',
                      status: 200,
                    }));
                } else {
                  res.status(401).json('Password is incorrect');
                }
              });
          });
      })
      .catch(next);
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
