const fs = require('fs');
const path = require('path');
const supertest = require('supertest');
const { compileStrapi, createStrapi } = require('@strapi/core');

const appRoot = path.resolve(__dirname, '..', '..');
const dbFile = path.join(appRoot, '.tmp', 'test.db');

const ensurePublicPermissions = async (strapi, actions) => {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!role) {
    throw new Error('Public role not found');
  }

  const permissions = strapi.db.query('plugin::users-permissions.permission');

  for (const action of actions) {
    const existing = await permissions.findOne({
      where: { action, role: role.id },
    });

    if (!existing) {
      await permissions.create({
        data: {
          action,
          role: role.id,
          enabled: true,
        },
      });
      continue;
    }

    if (!existing.enabled) {
      await permissions.update({
        where: { id: existing.id },
        data: { enabled: true },
      });
    }
  }
};

describe('checkbox-list custom field (API)', () => {
  let strapi;
  let request;

  beforeAll(async () => {
    process.chdir(appRoot);
    process.env.NODE_ENV = 'test';
    process.env.HOST = '127.0.0.1';
    process.env.PORT = '1339';
    process.env.STRAPI_DISABLE_ADMIN = 'true';
    process.env.STRAPI_TELEMETRY_DISABLED = 'true';
    process.env.DATABASE_FILENAME = '.tmp/test.db';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
    process.env.ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'test-admin-jwt-secret';
    process.env.APP_KEYS =
      process.env.APP_KEYS || 'testKey1,testKey2,testKey3,testKey4';

    if (fs.existsSync(dbFile)) {
      fs.rmSync(dbFile);
    }

    const appContext = await compileStrapi();
    strapi = createStrapi(appContext);
    strapi.log.level = 'error';

    await strapi.start();

    request = supertest(`http://127.0.0.1:${process.env.PORT}`);

    await ensurePublicPermissions(strapi, [
      'api::checkbox-item.checkbox-item.find',
      'api::checkbox-item.checkbox-item.findOne',
      'api::checkbox-item.checkbox-item.create',
      'api::checkbox-item.checkbox-item.update',
      'api::checkbox-item.checkbox-item.delete',
    ]);
  });

  afterAll(async () => {
    if (strapi) {
      await strapi.destroy();
    }
  });

  test('creates and reads entries with checkbox list values', async () => {
    const createResponse = await request.post('/api/checkbox-items').send({
      data: {
        title: 'First',
        choices: ['alpha', 'beta'],
        choicesRequired: ['alpha'],
        choicesPrivate: ['secret'],
        choicesDefault: ['defaultA'],
      },
    });

    expect([200, 201]).toContain(createResponse.status);
    const documentId = createResponse.body?.data?.documentId;
    expect(documentId).toBeTruthy();

    const fetchResponse = await request.get(`/api/checkbox-items/${documentId}`);
    expect(fetchResponse.status).toBe(200);
    expect(fetchResponse.body?.data?.choices).toEqual(['alpha', 'beta']);
  });

  test('enforces required checkbox list field', async () => {
    const response = await request.post('/api/checkbox-items').send({
      data: {
        title: 'Missing required',
        choices: ['alpha'],
      },
    });

    expect(response.status).toBe(400);
  });

  test('applies default values and hides private field', async () => {
    const createResponse = await request.post('/api/checkbox-items').send({
      data: {
        title: 'Defaults',
        choices: ['beta'],
        choicesRequired: ['beta'],
      },
    });

    expect([200, 201]).toContain(createResponse.status);
    const documentId = createResponse.body?.data?.documentId;
    expect(documentId).toBeTruthy();

    const fetchResponse = await request.get(`/api/checkbox-items/${documentId}`);
    expect(fetchResponse.status).toBe(200);

    const data = fetchResponse.body?.data;
    expect(data?.choicesDefault).toEqual(['defaultA']);
    expect(data?.choicesPrivate).toBeUndefined();
  });

  test('updates entries with checkbox list values', async () => {
    const createResponse = await request.post('/api/checkbox-items').send({
      data: {
        title: 'Update me',
        choices: ['alpha'],
        choicesRequired: ['alpha'],
      },
    });

    const documentId = createResponse.body?.data?.documentId;
    expect(documentId).toBeTruthy();

    const updateResponse = await request.put(`/api/checkbox-items/${documentId}`).send({
      data: {
        choices: ['alpha', 'gamma'],
        choicesRequired: ['alpha'],
      },
    });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body?.data?.choices).toEqual(['alpha', 'gamma']);
  });
});
