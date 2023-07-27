import jwt from "jsonwebtoken";

import { Request, Response } from "express";

import multer from 'multer'

import path from 'path'

// import {fileTypeFromFile} from 'file-type';

const config = process.env;

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const verifyToken = (req:Request, res:Response, next:any) => {

  const tokenString = req.body.token || req.query.token || req.headers?.authorization;

  // console.log(req.query.token);
  
  const token = tokenString.replace("Bearer ", "");

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded:any = jwt.verify(token, config.JWT_SECRET);

    const admin = decoded.role;
    
    if(admin == 'Admin')
    {
      req.body = decoded;

    }else
    {
      return res.status(400).send({msg:"You don't have access"});
    }
    

  } 
  catch (err) {

    return res.status(401).send("User unauthorized!");

  }
  return next();
};


// for image upload 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
 });
  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fileFilter = (req: Request, file: any, cb: any) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error());
  }

  const array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

  if (!array_of_allowed_file_types.includes(file.memetype)) {
    console.log('Invalid file');
  }

  // console.log(file); return false;
};

// for image upload 

const upload = multer({ storage: storage, fileFilter:fileFilter }).single('image');

const multiupload = multer({ storage: storage }).array('userPhoto',9);

export const auth = {
  upload,
  verifyToken,
  multiupload
}