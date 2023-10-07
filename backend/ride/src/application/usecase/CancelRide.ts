import RideRepository from "../repository/RideRepository";

export default class CancelRide {
  constructor (
    readonly rideRepository: RideRepository
  ) {}

  async execute (input: Input) {
    const { rideId } = input;
    const ride = await this.rideRepository.getById(rideId);
    ride.cancel()
    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string
}