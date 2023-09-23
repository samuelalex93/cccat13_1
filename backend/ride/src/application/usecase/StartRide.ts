import RideDAO from "../repository/RideDAO";

export default class StartRide {
  constructor(readonly rideDAO: RideDAO) {}

  async execute(rideId: string) {
    const ride = await this.rideDAO.getById(rideId);
    ride.start();
    await this.rideDAO.update(ride);
  }
}
