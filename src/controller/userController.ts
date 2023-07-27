import userStore from '../store/userStore';

import { Request, Response } from 'express';

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import Joi from 'joi';

import userInterface from '../store/userInterface';

// import multiImages from "../store/imagesInterface";

import SendResponse from '../utils/commonResponse';

import StatusCodeEnum from '../utils/statusCodeEnum';

import Roles from '../utils/enum';

import ErrorMessageEnum from '../utils/messages';

const storeUser = new userStore();

interface MyFile extends Express.Multer.File {}

export default class userController {
  public async create(req: Request, res: Response) {
    const schema = Joi.object().keys({
      // _id: Joi.string().optional(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().optional(),
      image: Joi.string().optional()
    });

    const params = schema.validate(req.body, { abortEarly: false });

    if (params.error) {
      console.log(params.error);

      return SendResponse(res, params.error, StatusCodeEnum.BAD_REQUEST);
      // return res.status(400).send(params.error);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { firstname, lastname, email, password, role, image } = params.value;

    const encryptedPassword = await bcrypt.hash(password, 10);

    // eslint-disable-next-line prefer-const
    let imageupload = req.file;

    const filename = imageupload.filename;

    const image_url = `${process.env.BASE_URL}/uploads/${filename}`;

    const userAttributes = {
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: encryptedPassword,
      role: Roles.Admin,
      image: image_url
    };

    try {
      const email = await storeUser.findByEmail(userAttributes.email);

      if (email) {
        return SendResponse(
          res,
          ErrorMessageEnum.USER_EXIST,
          StatusCodeEnum.BAD_REQUEST
        );
        // return res.status(400).send({msg:"Email already taken please try another one"});
      }
      let user: userInterface;
      // eslint-disable-next-line prefer-const
      user = await storeUser.createUser(userAttributes);

      return SendResponse(res, user, StatusCodeEnum.OK);
    } catch (e) {
      return SendResponse(e, ErrorMessageEnum.INVALID_REQUEST);
    }
  }

  // login user function

  public async login(req: Request, res: Response) {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required()
    });

    const params = schema.validate(req.body, { abortEarly: false });

    if (params.error) {
      console.log(params.error);
      // return res.status(400).send(params.error);
      return SendResponse(res, params.error, StatusCodeEnum.BAD_REQUEST);
    }

    const { email, password } = params.value;

    let user: userInterface;

    try {
      user = await storeUser.findByEmail(email);

      // SendResponse(res, user, StatusCodeEnum.OK);

      // return res.status(200).send({ user: user });

      if (!user) {
        // return res.status(400).send({ msg: "Email does not match" });
        return SendResponse(
          res,
          ErrorMessageEnum.NOT_EXIST,
          StatusCodeEnum.BAD_REQUEST
        );
      } else {
        const hashpassword = user.password;

        const comparePassword = await bcrypt.compare(password, hashpassword);

        if (comparePassword) {
          const secret = process.env.JWT_SECRET;

          const token = jwt.sign({ id: user._id, role: user.role }, secret, {
            expiresIn: '2h'
          });

          return SendResponse(
            res,
            token,
            ErrorMessageEnum.LOGGED_IN,
            StatusCodeEnum.OK
          );

          // return res.status(200).send({ msg: "Logged in Successfully",user:user.role, token: token});
        } else {
          return res.status(400).send({ msg: 'Credentials does not match' });
        }
      }
    } catch (e) {
      return SendResponse(e, ErrorMessageEnum.INVALID_REQUEST);
    }
  }

  public async welcome(req: Request, res: Response) {
    try {
      return res.status(200).send('Welcome 🙌 ');
    } catch (e) {
      console.log(e);
    }
  }

  // for multi images uploading

  public async storeMultiImages(req: Request, res: Response) {
    const imageUrlList = [];

    for (let i: number = 0; i < (req.files.length as number); i++) {
      const files = req.files[i];

      // and get image url as response

      // eslint-disable-next-line no-var
      var result = await storeUser.storeImages(files);

      imageUrlList.push(result);
    }

    const make_url = result.filename;

    const data = 'http://localhost:3000/uploads/' + make_url;

    const msg = 'Images uploded successfully';

    return res.status(200).send({ msg, data });
  }
}
