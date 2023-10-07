import crypto from "crypto";
import Cpf from "./Cpf";
import CarPlate from "./CarPlate";
import Email from "./Email";
import Name from "./Name";

export default class Account {
  private constructor(
    readonly accountId: string,
    readonly name: Name,
    readonly email: Email,
    readonly cpf: Cpf,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly carPlate: CarPlate,
    readonly date: Date,
    readonly verificationCode: string,
    readonly password: string
  ) {}

  static create(name:string, email:string, cpf:string, isPassenger:boolean, isDriver: boolean, carPlate:string, password: string) {
		const accountId = crypto.randomUUID();
		const verificationCode = crypto.randomUUID();
		const date = new Date();
		return new Account(accountId, new Name(name), new Email(email), new Cpf(cpf), isPassenger, isDriver, new CarPlate(carPlate), date, verificationCode, password);
  }
  
  static restore (accountId: string, name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate: string, date: Date, verificationCode: string, password:string) {
		return new Account(accountId, new Name(name), new Email(email), new Cpf(cpf), isPassenger, isDriver, new CarPlate(carPlate), date, verificationCode, password);
	}

  static encryptPassword(password: string) {
    return btoa(password)
  }

  static dencryptPassword(password: string) {
    return atob(password)
  }
}