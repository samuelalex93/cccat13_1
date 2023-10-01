import { RideStatus } from "../../@types/RideStatus";
import RideDAO from "../repository/RideDAO"

export default class finishRide {
  constructor(readonly rideDAO: RideDAO){}

  async execute(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
    if (ride.getStatus() != RideStatus.InProgress) throw new Error("Only rides with 'in_progress' status is accepted");
    const inputPosition = await this.rideDAO.getPositionByRideId(rideId)
    ride.calculateDistance(inputPosition)
    ride.calculatePrice()
    ride.finish()
    await this.rideDAO.finishRide(ride)
  }
}