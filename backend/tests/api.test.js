const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('CAD Blocks API', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('GET /api', () => {
    it('should return API documentation', async () => {
      const response = await request(app).get('/api');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'CAD Blocks API');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('POST /api/files/upload', () => {
    it('should reject invalid file uploads', async () => {
      const response = await request(app)
        .post('/api/files/upload')
        .attach('file', Buffer.from('invalid content'), { filename: 'test.txt' });
      
      expect(response.statusCode).toBe(500);
    });
  });

  describe('GET /api/blocks', () => {
    it('should return empty array when no blocks exist', async () => {
      const response = await request(app).get('/api/blocks');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('blocks');
      expect(response.body.blocks).toHaveLength(0);
    });
  });
});