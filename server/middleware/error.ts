import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";


export default (err: any, req: Request, res: Response, next: NextFunction) => {
    // Error status code
    err.statusCode = err.statusCode || 500;

    // Error messagge
    err.message = err.message || 'Internal Server Error';

    // Wrong mongodb id error
    if(err.name == "CastError"){
         const message = `Resource not found: Invalid ${err.path}`;
         err = new ErrorHandler(message, 400);
    }

    // Duplicate key error
    if(err.code == 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} enterd`;
        err = new ErrorHandler(message, 400);
    }

    // Wrong jwt error
    if(err.name == "JsonWebTokenError"){
        const message = `Json Web Token is invalid try again`;
        err = new ErrorHandler(message, 400);
    }

    // JWT expired error
    if(err.name == "TokenExpiredError"){
        const message = `Json Web Token is expired try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })

}