const { test } = require("@jest/globals");
const connection = require('../server/database/config/connection')
const { dbBuild } = require("../server/database/config/build");
const{getNotes}=require('../server/database/queries/getNote')

beforeEach(()=>dbBuild)



test('getNotes ',()=>{
    return getNotes(1)
    .then((data)=>{
        expect(data.rowCount).toBe(2)
    })
    .catch(err =>{
        console.log(err+ ' test err')
    })
});

test('getNotes ',()=>{
  return getNotes(1)
  .then((data)=>{
      expect(data.rowCount).toBe(2)
  })
  .catch(err =>{
      console.log(err+ ' test err')
  })
});



afterAll(()=> connection.end())

