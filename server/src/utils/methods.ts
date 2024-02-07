import { IActivationToken, IUserRegistration } from './interfaces';
import jwt from 'jsonwebtoken';

export const env = (variable: string) => process.env[variable];

const secretKey = env('ACTIVATION_SECRET') ?? 'secret-key';

export const createActivationToken = (
  user: IUserRegistration,
): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token: string = createToken<IUserRegistration>(user);

  return {
    token,
    activationCode,
  };
};

export const createToken = <T>(
  data: T,
  expiresIn?: string | number,
): string => {
  return jwt.sign(
    {
      data,
    },
    secretKey,
    {
      expiresIn: expiresIn ?? '5m',
    },
  );
};
