export interface ILoginFormData {
  login: string;
  password: string;
}

export interface IRegistartionFormData {
  contact: string;
  username?: string;
  login: string;
  password: string;
}

export interface IUserInfoBody {
  about: string;
  gender: string | null;
  recommendation: boolean;
}

export interface ICommentBody {
  content: string;
  under_comment: number | null;
}
