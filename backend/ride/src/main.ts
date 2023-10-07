import ExpressAdapter from "./infra/http/ExpressAdapter";
import Signup from "./application/usecase/Signup";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import AccountDAODatabase from "./infra/repository/AccountRepositoryDatabase";
import RideDAODatabase from "./infra/repository/RideRepositoryDatabase";
import GetAccount from "./application/usecase/GetAccount";
import MainController from "./infra/controller/MainController";
import RequestRide from "./application/usecase/RequestRide";
import GetRide from "./application/usecase/GetRide";
import Signin from "./application/usecase/Signin";

const connection = new PgPromiseAdapter()
const accountDAO = new AccountDAODatabase(connection)
const rideDAO = new RideDAODatabase(connection)
const signup = new Signup(accountDAO)
const signin = new Signin(accountDAO)
const getAccount = new GetAccount(accountDAO)
const requestRide = new RequestRide(rideDAO, accountDAO);
const getRide = new GetRide(rideDAO, accountDAO);
const httpServer = new ExpressAdapter()
new MainController(httpServer, signup,signin, getAccount, requestRide, getRide)
httpServer.listen(3000)