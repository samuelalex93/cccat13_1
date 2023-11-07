import { sign, verify} from "jsonwebtoken";
import Account from "./Account";

export default class TokenGenerator {
  static generate(account: Account, date: Date) {
    const expireIn = 1000000;
    return sign({cpf: account.cpf.getValue(), iat: date.getTime(), expireIn}, "secret")
  }

  static verify (token: string) : any {
    return verify(token, "secret")
  }
}