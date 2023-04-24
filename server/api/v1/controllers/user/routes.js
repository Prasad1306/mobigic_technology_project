
import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';

export default Express.Router()

    .post('/signup', controller.signup)
    .post('/login', controller.login)


    .use(auth.verifyToken)
    .get('/getProfile', controller.getProfile)

    .use(upload.uploadFile)
    .post('/uploadFile', controller.uploadFile)
    
