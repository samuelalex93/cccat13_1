import ExpressAdapter from "./infra/http/ExpressAdapter";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import MainController from "./infra/controller/MainController";
import RequestRide from "./application/usecase/RequestRide";
import GetRide from "./application/usecase/GetRide";
import AccountGatewayHttp from "./infra/gateway/AccountGatewayHttp";
import AxiosAdapter from "./infra/http/AxiosAdapter";
import RideRepositoryDatabase from "./infra/repository/RideRepositoryDatabase";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";
import UpdateRideProjection from "./application/handler/UpdateRideProjection";
import QueueController from "./infra/controller/QueueController";
import Registry from "./infra/di/Registry";
import RepositoryDatabaseFactory from "./infra/factory/RepositoryDatabaseFactory";

const connection = new PgPromiseAdapter()
const httpClient = new AxiosAdapter()
const queue = new RabbitMQAdapter();
const accountGateway = new AccountGatewayHttp(httpClient)
const rideRepository = new RideRepositoryDatabase(connection)
const repositoryFactory = new RepositoryDatabaseFactory(connection)
const requestRide = new RequestRide(repositoryFactory, accountGateway)
const getRide = new GetRide(rideRepository, accountGateway)
const updateRideProjection = new UpdateRideProjection(rideRepository, accountGateway, connection);
const httpServer = new ExpressAdapter()
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("requestRide", requestRide);
Registry.getInstance().provide("getRide", getRide);
Registry.getInstance().provide("updateRideProjection", updateRideProjection);
Registry.getInstance().provide("queue", queue);
new MainController()
new QueueController();
httpServer.listen(3001)