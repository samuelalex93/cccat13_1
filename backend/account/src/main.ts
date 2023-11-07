import ExpressAdapter from "./infra/http/ExpressAdapter";
import Signup from "./application/usecase/Signup";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import AccountRepositoryDatabase from "./infra/repository/AccountRepositoryDatabase";
import GetAccount from "./application/usecase/GetAccount";
import MainController from "./infra/controller/MainController";

import Signin from "./application/usecase/Signin";
import RepositoryDatabaseFactory from "./infra/factory/RepositoryDatabaseFactory";

const connection = new PgPromiseAdapter()
const accountDAO = new AccountRepositoryDatabase(connection)
const repositoryFactory = new RepositoryDatabaseFactory(connection);
const signup = new Signup(accountDAO)
const signin = new Signin(accountDAO)
const getAccount = new GetAccount(accountDAO)
const httpServer = new ExpressAdapter()
new MainController(httpServer, signup,signin, getAccount)
httpServer.listen(3000)