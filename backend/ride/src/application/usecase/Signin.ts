import Account from "../../domain/Account";
import TokenGenerator from "../../domain/TokenGererator";
import AccountDAO from "../repository/AccountDAO";

export default class Signin {

  constructor(readonly accountDAO: AccountDAO){ }

  async execute(input: Input): Promise<Output>{
    const account = await this.accountDAO.getByCPF(input.cpf);
    if(!account) throw new Error("There no any account with this CPF")
    const password = Account.dencryptPassword(account?.password)
    if(input.password != password) throw new Error("Invalid password")
    const token = TokenGenerator.create("secret", account.accountId, new Date());
    return {
      token
    };
  }
}

type Input = {
	cpf: string,
  password: string
}
type Output = {
  token: string
}