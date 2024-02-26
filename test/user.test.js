import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";
import {createTestUser, getTestUser, removeTestUser} from "./test-util.js";

describe('POST /api/users', function () {
    beforeEach(async () => {
        await removeTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    })

    it('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                "userName" : "testing",
                "pin" : "123456",
                "accountNumber" : "1234567890",
                "emailAddress" : "renaldy@gmail.com",
                "identityNumber" : "1234567890123456"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.userName).toBe("testing");
        expect(result.body.data.accountNumber).toBe("1234567890");
        expect(result.body.data.emailAddress).toBe("renaldy@gmail.com");
        expect(result.body.data.identityNumber).toBe("1234567890123456");
        expect(result.body.data.pin).toBeUndefined();
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                "userName" : "",
                "pin" : "",
                "accountNumber" : "",
                "emailAddress" : "",
                "identityNumber" : ""
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if username already exist', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                "userName" : "testing",
                "pin" : "123456",
                "accountNumber" : "1234567891",
                "emailAddress" : "renaldy1@gmail.com",
                "identityNumber" : "1234567890123455"
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.userName).toBe("testing");
        expect(result.body.data.accountNumber).toBe("1234567891");
        expect(result.body.data.emailAddress).toBe("renaldy1@gmail.com");
        expect(result.body.data.identityNumber).toBe("1234567890123455");
        expect(result.body.data.pin).toBeUndefined();

        result = await supertest(web)
            .post('/api/users')
            .send({
                "userName" : "testing",
                "pin" : "123456",
                "accountNumber" : "1234567890",
                "emailAddress" : "renaldy@gmail.com",
                "identityNumber" : "1234567890123456"
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('POST /api/users/login', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can login', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                userName: "testing",
                pin: "123456"
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.token_type).toBe("Bearer");
        expect(result.body.data.access_token).toBeDefined();
        expect(result.body.data.expiresIn).toBeDefined();
    });

    it('should reject login if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                userName: "",
                pin: ""
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if pin is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                userName: "testing",
                pin: "123455"
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if username is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                userName: "testing1",
                pin: "123456"
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/users/me', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can get current user', async () => {
        let login = await supertest(web)
            .post("/api/users/login")
            .send({
                userName: "testing",
                pin: "123456"
            });

        const result = await supertest(web)
            .get('/api/users/me')
            .set("Authorization", `${login.body.data.token_type} ${login.body.data.access_token}`)

        expect(result.status).toBe(200);
        expect(result.body.data.userName).toBe("testing");
        expect(result.body.data.accountNumber).toBeDefined();
        expect(result.body.data.emailAddress).toBeDefined();
        expect(result.body.data.identityNumber).toBeDefined();
        expect(result.body.data.pin).toBeUndefined();
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(web)
            .get('/api/users/me')
            .set('Authorization', 'Bearer sds');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/users/account_number/:accountNumber', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can get user by account number', async () => {
        let login = await supertest(web)
            .post("/api/users/login")
            .send({
                userName: "testing",
                pin: "123456"
            });

        const result = await supertest(web)
            .get('/api/users/account_number/1234567890')
            .set("Authorization", `${login.body.data.token_type} ${login.body.data.access_token}`)

        expect(result.status).toBe(200);
        expect(result.body.data.userName).toBe("testing");
        expect(result.body.data.accountNumber).toBe("1234567890");
        expect(result.body.data.emailAddress).toBeDefined();
        expect(result.body.data.identityNumber).toBeDefined();
        expect(result.body.data.pin).toBeUndefined();
    });

    it('should reject if account number is not exist', async () => {
        let login = await supertest(web)
            .post("/api/users/login")
            .send({
                userName: "testing",
                pin: "123456"
            });

        const result = await supertest(web)
            .get('/api/users/account_number/1234567891')
            .set("Authorization", `${login.body.data.token_type} ${login.body.data.access_token}`)

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if account number is invalid', async () => {
        let login = await supertest(web)
            .post("/api/users/login")
            .send({
                userName: "testing",
                pin: "123456"
            });

        const result = await supertest(web)
            .get('/api/users/account_number/12345678ab')
            .set("Authorization", `${login.body.data.token_type} ${login.body.data.access_token}`)

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(web)
            .get('/api/users/me')
            .set('Authorization', 'Bearer sds');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/users/identity_number/:identityNumber', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can get user by account number', async () => {
        let login = await supertest(web)
            .post("/api/users/login")
            .send({
                userName: "testing",
                pin: "123456"
            });

        const result = await supertest(web)
            .get('/api/users/identity_number/1234567890123456')
            .set("Authorization", `${login.body.data.token_type} ${login.body.data.access_token}`)

        expect(result.status).toBe(200);
        expect(result.body.data.userName).toBe("testing");
        expect(result.body.data.accountNumber).toBeDefined();
        expect(result.body.data.emailAddress).toBeDefined();
        expect(result.body.data.identityNumber).toBe("1234567890123456");
        expect(result.body.data.pin).toBeUndefined();
    });

    it('should reject if account number is not exist', async () => {
        let login = await supertest(web)
            .post("/api/users/login")
            .send({
                userName: "testing",
                pin: "123456"
            });

        const result = await supertest(web)
            .get('/api/users/identity_number/1234567890123450')
            .set("Authorization", `${login.body.data.token_type} ${login.body.data.access_token}`)

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if account number is invalid', async () => {
        let login = await supertest(web)
            .post("/api/users/login")
            .send({
                userName: "testing",
                pin: "123456"
            });

        const result = await supertest(web)
            .get('/api/users/identity_number/1234567890123abc')
            .set("Authorization", `${login.body.data.token_type} ${login.body.data.access_token}`)

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(web)
            .get('/api/users/me')
            .set('Authorization', 'Bearer sds');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('PATCH /api/users/me', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can update user', async () => {
        let login = await supertest(web)
            .post("/api/users/login")
            .send({
                userName: "testing",
                pin: "123456"
            });
        
        logger.info(login.body.data);

        let result = await supertest(web)
            .patch("/api/users/me")
            .set("Authorization", `${login.body.data.token_type} ${login.body.data.access_token}`)
            .send({
                emailAddress: "renaldy-test@gmail.com"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.userName).toBe("testing");
        expect(result.body.data.emailAddress).toBe("renaldy-test@gmail.com");

        const user = await getTestUser();
        expect(user.emailAddress).toBe("renaldy-test@gmail.com");
    });

    it('should reject if request is not valid', async () => {
        let login = await supertest(web)
            .post("/api/users/login")
            .send({
                userName: "testing",
                pin: "123456"
            });

        const result = await supertest(web)
            .patch("/api/users/me")
            .set("Authorization", `${login.body.data.token_type} ${login.body.data.access_token}`)
            .send({
                userName: "",
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('DELETE /api/users/me', function () {
    afterEach(async () => {
        await removeTestUser();
    })

    beforeEach(async () => {
        await createTestUser();
    });

    it('should can be delete', async () => {
        let login = await supertest(web)
            .post("/api/users/login")
            .send({
                userName: "testing",
                pin: "123456"
            });
        
        logger.info(login.body.data);

        const result = await supertest(web)
            .delete('/api/users/me')
            .set("Authorization", `${login.body.data.token_type} ${login.body.data.access_token}`);

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        const user = await getTestUser();
        expect(user).toBeNull();
    });

    it('should reject delete if token is invalid', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'Bearer jkjkj');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});
