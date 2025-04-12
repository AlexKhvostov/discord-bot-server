const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  it('should return 400 when GUILD_ID is not set', async () => {
    const res = await request(app)
      .get('/users');
    expect(res.statusCode).toEqual(400);
  });

  it('should return 400 when CHANNEL_ID is not set', async () => {
    const res = await request(app)
      .post('/messages')
      .send({
        content: 'Test message'
      });
    expect(res.statusCode).toEqual(400);
  });
}); 