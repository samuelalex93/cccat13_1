import GetAccount from "../../application/usecase/GetAccount";
import Signup from "../../application/usecase/Signup";
import HttpServer from "../http/HttpServer";

export default class MainController {
  constructor(readonly httpServer: HttpServer, signup: Signup, getAccount: GetAccount){
    httpServer.on("post", "/signup",async (params:any, body:any) => {
      const output = await signup.execute(body)
      return output
    })
    httpServer.on("get", "/accounts/:accountId",async (params:any, body:any) => {
      const output = await getAccount.execute(params.accountId)
      return output
    })
  }

}