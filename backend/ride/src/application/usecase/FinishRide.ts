import { RideStatus } from "../../@types/RideStatus";
import RideRepository from "../repository/RideRepository";

export default class finishRide {
  constructor(readonly rideRepository: RideRepository){}

  async execute(rideId: string) {
    const ride = await this.rideRepository.getById(rideId)
    if (ride.getStatus() != RideStatus.InProgress) throw new Error("Only rides with 'in_progress' status is accepted");
    const inputPosition = await this.rideRepository.getPositionByRideId(rideId)
    ride.calculateDistance(inputPosition)
    ride.calculatePrice()
    ride.finish()
    await this.rideRepository.finishRide(ride)
  }
}