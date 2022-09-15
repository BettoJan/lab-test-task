import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DatabaseService } from '../src/core/database/database.service';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { Token } from 'src/auth/common/types';
import { IUser } from '../src/user/types/user.interface';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let pg: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    pg = app.get<DatabaseService>(DatabaseService);
    await pg.cleanDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      username: 'testtest',
      password: 'test1111',
    };

    let tokens: Token;
    let user: IUser;

    it('/auth/local/signup (POST) - success', async () => {
      return request(app.getHttpServer())
        .post('/auth/local/signup')
        .send(dto)
        .expect(201)
        .expect(({ body }: { body: Token }) => {
          expect(body.accessToken).toBeTruthy();
        });
    });
    it('/auth/login (POST) - fail password', () => {
      return request(app.getHttpServer())
        .post('/auth/local/signin')
        .send({ ...dto, password: 'test2222' })
        .expect(401, {
          statusCode: 401,
          message: 'Пароли не совпадают',
          error: 'Unauthorized',
        });
    });
    it('/auth/login (POST) - fail username', () => {
      return request(app.getHttpServer())
        .post('/auth/local/signin')
        .send({ ...dto, username: 'mda' })
        .expect(401, {
          statusCode: 401,
          message: 'Пользователь с таким именем не найден',
          error: 'Unauthorized',
        });
    });
    it('/auth/local/signin(POST) - success', async () => {
      return request(app.getHttpServer())
        .post('/auth/local/signin')
        .send(dto)
        .expect(200)
        .expect(({ body }: { body: Token }) => {
          expect(body.accessToken).toBeTruthy();
          tokens = body;
        });
    });

    it('/user(GET) - success findAll', async () => {
      return request(app.getHttpServer())
        .get('/user')
        .send(dto)
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(200)
        .expect(({ body }: request.Response) => {
          expect(body.length).toBe(1);
          user = body;
        });
    });
    it('/user(GET) - fail findAll', async () => {
      return request(app.getHttpServer())
        .get('/user')
        .send(dto)
        .set('Authorization', `Bearer ${tokens.accessToken + 1}`)
        .expect(401, { statusCode: 401, message: 'Unauthorized' });
    });
    it('/user/:userId (GET) - success', async () => {
      return request(app.getHttpServer())
        .get(`/user/` + user[0].id)
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(200)
        .then(({ body }: request.Response) => {
          expect(body.length).toBe(1);
        });
    });
    it('/user/:id (DELETE) - success', () => {
      return request(app.getHttpServer())
        .delete('/user/' + user[0].id)
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(200);
    });
    it('/user/:id (DELETE) - fail', async () => {
      return request(app.getHttpServer())
        .delete('/user/' + 0)
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(401, {
          statusCode: 401,
          message: 'Пользователь с таким id не найден',
          error: 'Unauthorized',
        });
    });
  });
});
