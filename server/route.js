const router = require('express').Router();

router.get('/notes',(req,res)=>{
  res.send('Welcome in notes page');
})
 module.exports = router;
