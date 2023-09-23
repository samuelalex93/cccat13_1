import { RideStatus } from "../../@types/RideStatus";
import RideDAO from "../repository/RideDAO"

export default class finishRide {
  constructor(readonly rideDAO: RideDAO){}

  async execute(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
    if (ride.getStatus() != RideStatus.InProgress) throw new Error("Only rides with 'in_progress' status is accepted");
    const inputPosition = await this.getPositionByRideId(rideId) as any
    const distance = this.getDistance(inputPosition)
    const fare = this.calculeteRideValue(distance)
    ride.finish(fare, distance)
    await this.rideDAO.finishRide(ride)
  }

  async getPositionByRideId(rideId: string) {
    const position = await this.rideDAO.getPositionByRideId(rideId) as any
    const from = {
      lat: position[0].lat,
      long: position[0].long
    }
    const to = {
      lat: position[position.length - 1].lat,
      long: position[position.length - 1].long
    }
    return {from, to}
  }

  getDistance(input: any) {
    const {from, lat} = input
    return 10;
  }

  calculeteRideValue(distance: number){
    return 2.1*distance
  }
}