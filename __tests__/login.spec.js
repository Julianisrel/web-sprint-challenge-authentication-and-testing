const server = require('./api/server.js')
const request = require('supertest')

describe('POST /users', function() {
  it('responds with json', function(done) {
    request(server)
      .post('api/auth/login')
      .send({username: 'john', password: 'password'})
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
