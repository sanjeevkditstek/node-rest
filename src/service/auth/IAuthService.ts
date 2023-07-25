import IROLE from "../../utils/interface/role/IRole";
import IUPDATEUSER from "../../utils/interface/user/IUpdateUser";
import { IResponse } from "../../utils/interface/common";
import { Request, Response , NextFunction} from "express";

export interface IAuthServiceAPI {
    authenticate(request: Request, response: Response , next: NextFunction): void;
    // getRoleByName(request: IGetRoleByNameRequest, response: IGetRoleByNameResponse): void;
    // getRoleById(request: IGetRoleRequest, response: IGetRoleResponse): void;
    // getRoleList(request: IGetAllRoleRequest, response: IGetAllRoleResponse): void;
    // deleteRole(request: IDeleteRoleRequest, response: IDeleteRoleResponse);
    // updateRole(request: IUpdateRoleRequest, response: IUpdateRoleResponse);
}

/********************************************************************************
 *  Create Role
 ********************************************************************************/
export interface IAuthRequest extends Request {
   user?:{
    id: string,
    role: string,
    email: string
   }
}

export interface ICreateRoleResponse extends IResponse {
    role?: IROLE;
}

/********************************************************************************
 * get Role By Name
 ********************************************************************************/
export interface IAuthJWTData {
    
        id: string,
        role: string,
        email: string
       
}
export interface IGetRoleByNameResponse extends IResponse {
    role?: IROLE;
}

/********************************************************************************
 *  Get Role
 ********************************************************************************/

export interface IGetRoleRequest extends Request {
    params: {
        id: string;
    }
}
export interface IGetRoleResponse extends IResponse {
    role?: IROLE;
}


/********************************************************************************
 *  Get all Role
 ********************************************************************************/

export interface IGetAllRoleRequest extends Request {

}
export interface IGetAllRoleResponse extends IResponse {
    roles?: IROLE[];
}


/********************************************************************************
 *  update Role
 ********************************************************************************/


export interface IUpdateRoleRequest extends Request {
    params: {
        id: string;
    },
    body: {
        name?: string;
    }
}


export interface IUpdateRoleResponse extends IResponse {
    user?: IROLE;
}


// /********************************************************************************
//  *  Delete Role
//  ********************************************************************************/


export interface IDeleteRoleRequest extends Request {
    params: {
        id: string
    }
}
export interface IDeleteRoleResponse extends IResponse {
    user?: IROLE;
}
