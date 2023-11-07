import GetAccount from "../../application/usecase/GetAccount";
import Signin from "../../application/usecase/Signin";
import Signup from "../../application/usecase/Signup";
import HttpServer from "../http/HttpServer";

export default class MainController {
  constructor(readonly httpServer: HttpServer, signup: Signup, signin: Signin, getAccount: GetAccount){
    httpServer.on("post", "/signup",async (params:any, body:any) => {
      const output = await signup.execute(body)
      return output
    })
    httpServer.on("post", "/signin",async (params:any, body:any) => {
      const output = await signin.execute(body)
      return output
    })
    httpServer.on("get", "/accounts/:accountId",async (params:any, body:any) => {
      const output = await getAccount.execute(params.accountId)
      return output
    })
  }
}