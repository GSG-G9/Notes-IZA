const router = require('express').Router();
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
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).required(),
  });
  const result = schema.validate({ email, password });
  if (result.error === undefined) {
const hashedPassword = getHashedPassword(email)
bcrypt.compare(password, hashedPassword);
    getUser(email, req.body.content, req.params.userID)
      .then(({ rows }) => res.status(200).json({
        data: rows,
        msg: 'success',addNote
        status: 200
      })).catch(next);
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
