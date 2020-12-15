const app = require('./app.js');

app.listen(app.get('port'),()=>{
  console.log(`Server is running at http://localhost:${app.get('port')}`)
})