import Account from "../../domain/Account";
import TokenGenerator from "../../domain/TokenGererator";
import AccountRepository from "../repository/AccountRepository";

export default class Signin {

  constructor(readonly accountRepository: AccountRepository){ }

  async execute(input: Input): Promise<Output>{
    const account = await this.accountRepository.getByCPF(input.cpf);
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