import { userModel } from "../model/user";

import userInterface from "./userInterface";

import multiImages from "./imagesInterface"

import { imagesModel } from '../model/user';

export default class userStore { 

    async createUser(attributes:userInterface){

        let user:userInterface;

        try {

            user = await userModel.create(attributes);

            return user;

        } catch(e){

            console.log(e);
            
        }
    }

    async findByEmail(email:string){

        try {

            const user = await userModel.findOne({email});

            return user;

        } catch(e) {
            
            console.log(e);
            
        }
    }
// upload multiple images

    async storeImages(file:multiImages){

        let files:multiImages;

        try {

            files = await imagesModel.create(file);

            return files;

        } catch(e) {

            console.log(e);
            
        }
    }
}