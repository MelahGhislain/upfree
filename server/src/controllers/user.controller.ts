import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import { UserModel } from '../models/user.model';
import { IActivationToken, IUserRegistration } from '../utils/interfaces';
import { createActivationToken } from '../utils/methods';
import ejs from 'ejs';
import path from 'path';
import MailService from '../services/mailService';

const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      // Verify if a user with this email already exists
      const emailExist = await UserModel.findOne({ email: email });

      if (emailExist) {
        return next(
          new ErrorHandler('A user with this email already exists', 400),
        );
      }

      const user: IUserRegistration = {
        name,
        email,
        password,
      };

      const activationToken: IActivationToken = createActivationToken(user);

        // User activation code
      const activationCode: string = activationToken.activationCode;

      const data = {user: {name: user.name}, activationCode };

      const html = await ejs.renderFile(path.join(__dirname, '../templates/activation.ejs'), data);
    //   Send email for activation
      try {
        const mailService = MailService.getInstance();
        await mailService.sendMail({
            email: user.email,
            subject: 'Account Activation',
            template: 'activation.ejs',
            data
        });
      } catch (error) {
        console.log(error);
      }

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
