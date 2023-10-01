import Account from "../../domain/Account";
import AccountDAO from "../repository/AccountDAO";

export default class Signin {

  constructor(readonly accountDAO: AccountDAO){ }

  async execute(input: Input){
    const account = await this.accountDAO.getByCPF(input.cpf);
    if(!account) throw new Error("There no any account with this CPF")
    const password = Account.dencryptPassword(account?.password)
    if(input.password != password) throw new Error("Invalid password")
    //retornar jtw
    return {
      accountId: account.accountId,
    };
  }
}

type Input = {
	cpf: string,
  password: string
}