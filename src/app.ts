import express, { Application } from 'express'

import {connect, ConnectOptions } from 'mongoose'

import route from './routes/index';

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config()

const url = "mongodb://localhost:27017/jwt-crud";

const port = process.env.PORT;

export default class App {

    public app: Application;
    public port:number;

    constructor (port: number){

        this.app = express();
        this.port = port;
        this.app.use(express.json());
        this.connectToRoute(); 
        this.connectToMongo();
        this.staticAssests();
    }

    private connectToMongo(){

        connect(`${url}`,{
            useUnifiedTopology: true,
            useNewUrlParser: true,

        } as ConnectOptions).then(() => {
            console.log("info->","Connected to mongoDB....");
        }).catch((e) => {
            console.log("info","There was and error to connect to mongodb");
            console.log(e);
        });
    }

    private connectToRoute(){
        this.app.use(express.json());

        this.app.use(route);
    }

    private staticAssests(){

        this.app.use(express.static('public'));
    }

    public listen(){
        this.app.listen(this.port,function(){
         console.log(`App listning on port ${port}`);
        });
    }
}