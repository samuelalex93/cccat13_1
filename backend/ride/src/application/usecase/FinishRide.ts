import { RideStatus } from "../../@types/RideStatus";
import PaymentGatewayHttp from "../../infra/gateway/PaymentGatewayHttp";
import AxiosAdapter from "../../infra/http/AxiosAdapter";
import Queue from "../../infra/queue/Queue";
import RabbitMQAdapter from "../../infra/queue/RabbitMQAdapter";
import PaymentGateway from "../gateway/PaymentGateway";
import PositionRepository from "../repository/PositionRepository";
import RideRepository from "../repository/RideRepository";
export default class finishRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository,
    readonly paymentGateway: PaymentGateway = new PaymentGatewayHttp(new AxiosAdapter()),
		readonly queue: Queue = new RabbitMQAdapter()
  ) {}

  async execute(rideId: string) {
    const ride = await this.rideRepository.getById(rideId);
    if (ride.getStatus() != RideStatus.InProgress)
      throw new Error("Only rides with 'in_progress' status is accepted");
    const inputPosition = await this.positionRepository.getPositionByRideId(
      rideId
    );
    ride.calculateDistance(inputPosition);
    ride.calculatePrice();
    ride.finish();
    await this.rideRepository.finishRide(ride);
  }
}
