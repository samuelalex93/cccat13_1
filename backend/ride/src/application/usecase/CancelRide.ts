import RideDAO from "../repository/RideDAO";

export default class CancelRide {
  constructor (
    readonly rideDAO: RideDAO
  ) {}

  async execute (input: Input) {
    const { rideId } = input;
    const ride = await this.rideDAO.getById(rideId);
    ride.cancel()
    await this.rideDAO.update(ride);
  }
}

type Input = {
  rideId: string
}