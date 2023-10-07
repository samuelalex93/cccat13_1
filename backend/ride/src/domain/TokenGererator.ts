import { sign, verify} from "jsonwebtoken";

export default class TokenGenerator {
  static create(key: string, accountId: string, date: Date) {
    const expireIn = 1000000;
    return sign({accountId, iat: date.getTime(), expireIn}, key)
  }

  static verify (key: string, token: string) : any {
    return verify(token, key)
  }
}