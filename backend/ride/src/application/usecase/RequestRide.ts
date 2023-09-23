import AccountDAO from "../repository/AccountDAO";
import Ride from "../../domain/Ride";
import RideDAO from "../repository/RideDAO";

export default class RequestRide {
  constructor(readonly rideDAO: RideDAO, readonly accountDAO: AccountDAO) {}

  async execute(input:Input) {
    const { accountId, from, to } = input;
    const account = await this.accountDAO.getById(accountId);
    if (!account?.isPassenger)
      throw new Error("Isn't passenger's account");
    const activeRides = await this.rideDAO.getActiveRidesByPassengerId(accountId);
    if (activeRides.length > 0)
      throw new Error("There active ride to this passeger");
    const ride = Ride.create(accountId, from.lat, from.long, to.lat, to.long)
    await this.rideDAO.save(ride)
    return { rideId: ride.rideId };
  }
}

type Input = {
  accountId: string,
	from: {
		lat: number,
		long: number
	},
	to: {
		lat: number,
		long: number
	}
}
