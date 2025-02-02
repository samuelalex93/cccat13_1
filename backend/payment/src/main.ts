import ExpressAdapter from "./infra/http/ExpressAdapter";
import MainController from "./infra/controller/MainController";
import Registry from "./infra/di/Registry";
import ProcessPayment from "./application/usecase/ProcessPayment";
import QueueController from "./infra/controller/QueueController";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";

const httpServer = new ExpressAdapter();
const queue = new RabbitMQAdapter();
const processPayment = new ProcessPayment(queue);
Registry.getInstance().provide("queue", queue);
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("processPayment", processPayment);
new MainController();
new QueueController();
httpServer.listen(3002);