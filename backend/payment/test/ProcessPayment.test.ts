import ProcessPayment from "../src/application/usecase/ProcessPayment";
import Queue from "../src/infra/queue/Queue";
import RabbitMQAdapter from "../src/infra/queue/RabbitMQAdapter";


let processPayment: ProcessPayment;
let queue: Queue

beforeEach(function () {
  queue = new RabbitMQAdapter();
  processPayment = new ProcessPayment(queue);
});

afterEach(async () => {
});

test("Deve criar um passageiro", async function () {
  const input: any = {
    payment: "aproved"  
  };
  await processPayment.execute(input);
})
