import Joi from "joi";
import _ from "lodash";
import config from "config";
import userModel from '../../../../models/user'
import commonFunction from '../../../../helper/util';
import jwt from 'jsonwebtoken';
import status from '../../../../enums/status';
import bcryptjs from 'bcryptjs';
import userType from "../../../../enums/userType";
import multer from "multer";
import fileModel from '../../../../models/file';
const upload = multer({ dest: 'uploads/' }).single('file');



export class userController {

    /**
     * @swagger
     * /user/signup:
     *   post:
     *     tags:
     *       - USER
     *     description: signup
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: userName
     *         description: userName
     *         in: formData
     *         required: true
     *       - name: password
     *         description: password
     *         in: formData
     *         required: true
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async signup(req, res, next) {
        const schema = Joi.object().keys({
            userName: Joi.string().required(),
            password: Joi.string().required(),
        });
        const { error, value } = Joi.validate(req.body, schema);
        if (error && error.details) {
            return res.status(422).json(error);
        }
        try {
            let user = await userModel.findOne({ userName: value.userName });
            if (user) {
                return res.status(400).json({ responseCode: 400, responseMessage: "User already exist" });
            }
            let salt = bcryptjs.genSaltSync(10);
            let hash = bcryptjs.hashSync(value.password, salt);
            value.password = hash;
            value.userType = userType.USER;
            value.status = status.ACTIVE;
            user = await userModel.create(value);
            let token = jwt.sign({ _id: user._id }, config.get('jwtsecret'), { expiresIn: '1d' });
            return res.status(200).json({ responseCode: 200, responseMessage: "User created successfully", data: { token: token } });
        } catch (err) {
            return next(err);
        }
    }

    /**
     * @swagger
     * /user/login:
     *   post:
     *     tags:
     *       - USER
     *     description: login
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: userName
     *         description: userName
     *         in: formData
     *         required: true
     *       - name: password
     *         description: password
     *         in: formData
     *         required: true
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async login(req, res, next) {
        const schema = Joi.object().keys({
            userName: Joi.string().required(),
            password: Joi.string().required(),
        });
        const { error, value } = Joi.validate(req.body, schema);
        if (error && error.details) {
            return res.status(422).json(error);
        }
        try {
            let user = await userModel.findOne({ userName: value.userName });
            if (!user) {
                return res.status(400).json({ responseCode: 400, responseMessage: "User not found" });
            }
            let isMatch = bcryptjs.compareSync(value.password, user.password);
            if (!isMatch) {
                return res.status(400).json({ responseCode: 400, responseMessage: "Password not matched" });
            }
            let token = jwt.sign({ _id: user._id }, config.get('jwtsecret'), { expiresIn: '1d' });
            return res.status(200).json({ responseCode: 200, responseMessage: "Login successfully", data: { user, token } });
        } catch (err) {
            return next(err);
        }
    }

    /**
     * @swagger
     * /user/getProfile:
     *   get:
     *     tags:
     *       - USER
     *     description: getProfile
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token
     *         in: header
     *         required: true
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async getProfile(req, res, next) {
        try {
            let user = await userModel.findOne({ _id: req.userId });
            if (!user) {
                return res.status(400).json({ responseCode: 400, responseMessage: "User not found" });
            }
            return res.status(200).json({ responseCode: 200, responseMessage: "User found successfully", data: user });
        } catch (err) {
            return next(err);
        }

    }

    /**
     * @swagger
     * /user/uploadFile:
     *   post:
     *     tags:
     *       - USER
     *     description: uploadFile
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: user token
     *         in: header
     *         required: true
     *       - name: file
     *         description: file
     *         in: formData
     *         type: file
     *         required: true
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async uploadFile(req, res, next) {
        try {
            upload(req, res, async (err) => {
                if (err) {
                    console.log("Something went wrong");
                }
                try {
                    const response = await commonFunction.getImageUrl(`uploads/${req.file.filename}`);
                    console.log("response", response);
                    const generateCode = await commonFunction.generateCode();
                    const file = await fileModel.create({ file: response.url, filecode: generateCode });
                    return res.status(200).json({ responseCode: 200, responseMessage: "File uploaded successfully", data: file });
                } catch (err) {
                    console.log("err", err);
                    return next(err);
                }
            })
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }

   

}
export default new userController();