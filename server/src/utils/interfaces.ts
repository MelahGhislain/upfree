// Users interface
export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface IActivationToken {
  token: string;
  activationCode: string;
}

export interface IMailOprions {
    from: string,
    to: string,
    cc?: string,
    bcc?: string,
    subject: string,
    text?: string,
    html: string
}

export interface IEmailOptions {
    email: string;
    subject: string;
    template: string;
    data: {[key: string]: any }
}
