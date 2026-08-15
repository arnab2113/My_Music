const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const seedAuto = require('../utils/seedAuto');

jest.setTimeout(30000);

let mongoServer;
let userToken;
let adminToken;
let testSongId;
let testPlaylistId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '4.4.29'
    }
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Run seed
  await seedAuto();

  // Login User to get token
  const userRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@nostalgiafm.com', password: 'User@123456' });
  userToken = userRes.body.token;

  // Login Admin to get token
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@nostalgiafm.com', password: 'Admin@123456' });
  adminToken = adminRes.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('1. Health Check API', () => {
  it('GET /api/health should return status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OK');
  });
});

describe('2. Authentication API', () => {
  it('POST /api/auth/register should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test QA User',
      email: 'qauser@nostalgiafm.com',
      password: 'Password@123'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toEqual('qauser@nostalgiafm.com');
  });

  it('POST /api/auth/login should fail with invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'user@nostalgiafm.com',
      password: 'WrongPassword'
    });
    expect(res.statusCode).toEqual(401);
  });

  it('GET /api/auth/profile should return current user profile', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual('user@nostalgiafm.com');
  });
});

describe('3. Songs API', () => {
  it('GET /api/songs should list seeded songs', async () => {
    const res = await request(app).get('/api/songs');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(15);
    testSongId = res.body[0]._id;
  });

  it('GET /api/songs/:id should return single song details', async () => {
    const res = await request(app).get(`/api/songs/${testSongId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(testSongId);
  });

  it('POST /api/songs/:id/play should increment play count', async () => {
    const res = await request(app).post(`/api/songs/${testSongId}/play`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('playsCount');
  });
});

describe('4. Radio Stations API', () => {
  it('GET /api/radio should return active radio stations', async () => {
    const res = await request(app).get('/api/radio');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThanOrEqual(8);
  });

  it('GET /api/radio/:slug should return station by slug', async () => {
    const res = await request(app).get('/api/radio/hindi-90s-classics');
    expect(res.statusCode).toEqual(200);
    expect(res.body.slug).toEqual('hindi-90s-classics');
  });
});

describe('5. Playlists API', () => {
  it('POST /api/playlists should create a custom playlist', async () => {
    const res = await request(app)
      .post('/api/playlists')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Late Night 90s Test Playlist' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual('Late Night 90s Test Playlist');
    testPlaylistId = res.body._id;
  });

  it('POST /api/playlists/:id/songs should add a song to playlist', async () => {
    const res = await request(app)
      .post(`/api/playlists/${testPlaylistId}/songs`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ songId: testSongId });
    expect(res.statusCode).toEqual(200);
    expect(res.body.songs.length).toBeGreaterThan(0);
  });

  it('DELETE /api/playlists/:id/songs/:songId should remove song from playlist', async () => {
    const res = await request(app)
      .delete(`/api/playlists/${testPlaylistId}/songs/${testSongId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.songs.length).toEqual(0);
  });
});

describe('6. Favorites API', () => {
  it('POST /api/favorites/toggle should toggle song favorite state', async () => {
    const res = await request(app)
      .post('/api/favorites/toggle')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ songId: testSongId });
    expect(res.statusCode).toEqual(200);
    expect(res.body.isFavorite).toBeTruthy();
  });

  it('GET /api/favorites should return list of user favorites', async () => {
    const res = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('7. Search API', () => {
  it('GET /api/search should return matches for query', async () => {
    const res = await request(app).get('/api/search?q=kumar');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('songs');
    expect(res.body).toHaveProperty('artists');
  });
});
