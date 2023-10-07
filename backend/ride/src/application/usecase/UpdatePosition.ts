import crypto from 'crypto';
import { RideStatus } from "../../@types/RideStatus";
import RideRepository from "../repository/RideRepository";

export default class UpdatePosition {
  constructor(readonly rideRepository: RideRepository){
  }

  async execute(input: Input) {
    const {rideId, lat, long} = input
    const ride = await this.rideRepository.getById(rideId)
    if(ride.getStatus() != RideStatus.InProgress) throw new Error("Only rides with 'in_progress' status is accepted")
    const positionId = crypto.randomUUID();
    const position = {
      positionId,
      rideId,
      lat,
      long,
      date: new Date()
    }
    await this.rideRepository.savePosition(position)
    return { positionId }
  }
}

type Input  = {
  rideId: string,
  lat: number,
  long: number
}