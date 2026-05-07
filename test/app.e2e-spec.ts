import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const createUserAndLogin = async (): Promise<string> => {
    await request(app.getHttpServer())
      .post("/auth/sign-up")
      .send({
        username: "testando",
        email: "testando@email.com",
        password: "123456789Np."
      });
    const response = await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send({
        email: "testando@email.com",
        password: "123456789Np."
      });
    return response.body.token;
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    prisma = app.get(PrismaService);
    await prisma.user.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.note.deleteMany();
    await prisma.card.deleteMany();

    await app.init();
  });

  it('GET /health => should return 200', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(HttpStatus.OK)
      .expect("I'm okay!");

    // const { status, text } = await request(app.getHttpServer()).get('/health')
    // expect(status).toBe(HttpStatus.OK);
    // expect(text).toBe("I'm okay!");
  });

  it("POST /sign-up => should sign-up successfully", async () => {
    await request(app.getHttpServer())
      .post("/auth/sign-up")
      .send({
        username: "testando",
        email: "testando@email.com",
        password: "123456789Np."
      })
      .expect(HttpStatus.CREATED);

    const user = await prisma.user.findFirst({
      where: {
        username: "testando"
      }
    });
    expect(user).not.toBe(null);
  })

  it("POST /credentials => should create a credential", async () => {
    const token = await createUserAndLogin();

    await request(app.getHttpServer())
      .post("/credentials")
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "teste rodando",
        url: "fomebook.com.br",
        username: "fabricio",
        password: "1234567890"
      })
      .expect(HttpStatus.CREATED);

    const credential = await prisma.credential.findFirst({
      where: {
        title: "teste rodando"
      }
    });

    expect(credential?.username).toBe("fabricio");
  });

  it("/signup => should deny a sign-up when data is wrong", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/sign-up")
      .send({
        username: "vai dar bom",
        email: "vai@email.com"
      })
    expect(HttpStatus.BAD_REQUEST);

    const errorMessages: string[] = response.body.message;
    expect(errorMessages).toContain("password should not be empty");
  });

  it("POST /notes => should create a note", async () => {
    const token = await createUserAndLogin();

    await request(app.getHttpServer())
      .post("/notes")
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Minha Nota",
        annotation: "Texto da nota",
        label: "pessoal",
        name: "nota 1"
      })
      .expect(HttpStatus.CREATED);

    const note = await prisma.note.findFirst({
      where: {
        title: "Minha Nota"
      }
    });

    expect(note?.annotation).toBe("Texto da nota");
  });

  it("POST /cards => should create a card", async () => {
    const token = await createUserAndLogin();

    const cardResponse = await request(app.getHttpServer())
      .post("/cards")
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Meu Cartao",
        numbercard: "123456789", 
        nameprintedcard: "FABRICIO",
        securitycode: "123",
        expirationdate: "2028-12-01T00:00:00.000Z",
        cardpassword: "password123",
        cardtype: "CREDIT",
        isvirtual: false 
      });

    
    if (cardResponse.status === HttpStatus.BAD_REQUEST) {
    }

    expect(cardResponse.status).toBe(HttpStatus.CREATED);

    const card = await prisma.card.findFirst({
      where: {
        title: "Meu Cartao"
      }
    });

    expect(card?.nameprintedcard).toBe("FABRICIO");
  });

  it("GET /credentials => should list credentials", async () => {
    const token = await createUserAndLogin();

    await request(app.getHttpServer())
      .post("/credentials")
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Minha credencial",
        url: "site.com",
        username: "user123",
        password: "password123"
      });

    const getResponse = await request(app.getHttpServer())
      .get("/credentials")
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(getResponse.body).toHaveLength(1);
    expect(getResponse.body[0].title).toBe("Minha credencial");
  });
});
