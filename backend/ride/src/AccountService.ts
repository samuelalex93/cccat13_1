import crypto from "crypto";
import CpfValidator from "./CpfValidator";
import Database from "./config/Database";
import AccountDAO from "./AccountDAO";
import AccountDAODatabase from "./AccountDAODatabase";

export default class AccountService {
  cpfValidator: CpfValidator;

  constructor(readonly accountDAO: AccountDAO = new AccountDAODatabase()) {
    this.cpfValidator = new CpfValidator();
  }

  async sendEmail(email: string, subject: string, message: string) {
    console.log(email, subject, message);
  }

  async signup(input: any) {
    const accountId = crypto.randomUUID();
    const verificationCode = crypto.randomUUID();
    const date = new Date();
    const existingAccount = await this.accountDAO.getByEmail(input.email);
    if (existingAccount) throw new Error("Account already exists");
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/))
      throw new Error("Invalid name");
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
    if (!this.cpfValidator.validate(input.cpf)) throw new Error("Invalid cpf");
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error("Invalid plate");
    const account = {
      accountId,
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      carPlate: input.carPlate,
      isPassenger: !!input.isPassenger,
      isDriver: !!input.isDriver,
      date,
      isVerified: false,
      verificationCode,
    };
    await this.accountDAO.save(account);
    await this.sendEmail(
      input.email,
      "Verification",
      `Please verify your code at first login ${verificationCode}`
    );
    return {
      accountId,
    };
  }

  async getAccount(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    return account;
  }
}
