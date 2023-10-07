import RideRepository from "../repository/RideRepository";

export default class StartRide {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(rideId: string) {
    const ride = await this.rideRepository.getById(rideId);
    ride.start();
    await this.rideRepository.update(ride);
  }
}
