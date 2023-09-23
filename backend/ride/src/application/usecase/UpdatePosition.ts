import crypto from 'crypto';
import { RideStatus } from "../../@types/RideStatus";
import RideDAO from "../repository/RideDAO";

export default class UpdatePosition {
  constructor(readonly rideDAO: RideDAO){
  }

  async execute(input: Input) {
    const {rideId, lat, long} = input
    const ride = await this.rideDAO.getById(rideId)
    if(ride.getStatus() != RideStatus.InProgress) throw new Error("Only rides with 'in_progress' status is accepted")
    const positionId = crypto.randomUUID();
    const position = {
      positionId,
      rideId,
      lat,
      long,
      date: new Date()
    }
    await this.rideDAO.updatePosition(position)
    return { positionId }
  }
}

type Input  = {
  rideId: string,
  lat: number,
  long: number
}