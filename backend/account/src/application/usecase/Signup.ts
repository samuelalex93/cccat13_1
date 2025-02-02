import Account from "../../domain/Account";
import AccountRepository from "../repository/AccountRepository";
import MailerGateway from "../../infra/gateway/MailerGateway";

export default class Signup {
  mailerGateway: MailerGateway

  constructor(readonly accountRepository: AccountRepository){
    this.mailerGateway = new MailerGateway()
  }

  async execute(input: Input){
    const existingAccount = await this.accountRepository.getByEmail(input.email);
    if (existingAccount) throw new Error("Account already exists");
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.isPassenger,
      input.isDriver,
      input.carPlate,
      input.password
    )
    await this.accountRepository.save(account);
    await this.mailerGateway.send(
      input.email,
      "Verification",
      `Please verify your code at first login ${account.verificationCode}`
    );
    return {
      accountId: account.accountId,
    };
  }
}

type Input = {
	name: string,
	email: string,
	cpf: string,
	isPassenger: boolean,
	isDriver: boolean,
	carPlate: string,
  password?: string
}