const request = require('supertest');
const app = require('../../src/app');

let token = '';

describe('USER', () => {
    describe('Sign Up', () => {
        it('should be able to register', async (done) => {
            const response = await request(app).post('/signup').send({
                username: 'Léo Soares',
                email: 'leosoares.midas@gmail.com',
                raw_password: '156324',
                confirm_password: '156324',
                admin: false
            });
            expect(201);
            done();
        });
    });

    describe('Sign In', () => {
        it('Should authenticate', async (done) => {
            const response = await request(app)
                .post('/signin')
                .send({
                    email: 'leosoares.midas@gmail.com',
                    password: '156324'
                })
                .then((res) => {
                    token = res.body.token;
                });
            expect(200);
            done();
        });
    });

    describe('Update', () => {
        it('Should be able to update user profile data', async (done) => {
            await request(app)
                .put('/user/1')
                .set('Authorization', 'Bearer' + token)
                .send({
                    phone: '(83)99604-7849'
                });
            expect(202);
            done();
        });
    });

    describe('Delete', () => {
        it('Should delete an user', async (done) => {
            await request(app)
                .delete('/user/1')
                .set('Authorization', 'Bearer' + token)
                .send({
                    email: 'leosoares.midas@gmail.com'
                });
            expect(200);
            done();
        });
    });

    describe('Duplicated', () => {
        it('Should return 401 status', async (done) => {
            await request(app).post('/signup').send({
                username: 'Léo Soares',
                email: 'leosoares.midas@gmail.com',
                raw_password: '156324',
                confirm_password: '156324',
                admin: false
            });
            expect(401);
            done();
        });
    });

    describe('Email not found', () => {
        it('Should return 400 status', async (done) => {
            await request(app).post('/signin').send({
                email: 'leandro.almeidaweb@gmail.com',
                password: '156324'
            });
            expect(400);
            done();
        });
    });

    describe('Wrong password', () => {
        it('Should return 401 status', async (done) => {
            await request(app).post('/signin').send({
                email: 'leosoares.midas@gmail.com',
                password: '123456'
            });
            expect(401);
            done();
        });
    });
});
