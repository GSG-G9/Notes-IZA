const router = require('express').Router();
const { getNotes } = require('./database/queries/getNote');
const { addNote } = require('./database/queries/addNote');

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

// error handling
router.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: err.status || 500,
    msg: err.msg || 'Internal Server Error',
    data: null,
  });
});
