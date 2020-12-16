const request = require('supertest');
const app = require('../server/app');
const connection = require('../server/database/config/connection');
const { dbBuild } = require('../server/database/config/build');

beforeEach(() => dbBuild());
test('router /notes ', (done) => request(app)

  .get('/notes/1')
  .expect(200)
  .end((err, response) => {
    if (err) {
      return done(err);
    }
    expect(JSON.parse(response.text).data.length).toBe(2);
    return done();
  }));
afterAll(() => connection.end());
