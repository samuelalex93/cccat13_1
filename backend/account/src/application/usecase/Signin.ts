import TokenGenerator from "../../domain/TokenGererator";
import AccountRepository from "../repository/AccountRepository";

export default class Signin {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getByCPF(input.cpf);
    if (!account) throw new Error("There no any account with this CPF");
    if (!account.password.validate(input.password))
      throw new Error("Authentication failed");

    const token = TokenGenerator.generate(
      account,
      new Date(input.date)
    );
    return {
      token
    };
  }
}

type Input = {
  cpf: string;
  password: string;
  date: Date;
};
type Output = {
  token: string;
};
