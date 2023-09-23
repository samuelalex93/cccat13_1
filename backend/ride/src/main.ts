import ExpressAdapter from "./infra/http/ExpressAdapter";
import Signup from "./application/usecase/Signup";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import AccountDAODatabase from "./infra/repository/AccountDAODatabase";
import RideDAODatabase from "./infra/repository/RideDAODatabase";
import GetAccount from "./application/usecase/GetAccount";
import MainController from "./infra/controller/MainController";

const connection = new PgPromiseAdapter()
const accountDAO = new AccountDAODatabase(connection)
const rideDAO = new RideDAODatabase(connection)
const signup = new Signup(accountDAO)
const getAccount = new GetAccount(accountDAO)
const httpServer = new ExpressAdapter()
new MainController(httpServer, signup, getAccount)
httpServer.listen(3000)