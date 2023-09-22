import AccountDAO from "../../AccountDAO";
import Ride from "../../Ride";
import RideDAO from "../../RideDAO";

export default class RequestRide {
  constructor(readonly rideDAO: RideDAO, readonly accountDAO: AccountDAO) {}

  async execute(input:Input) {
    const { passengerId, from, to } = input;
    const account = await this.accountDAO.getById(passengerId);
    if (!account.is_passenger)
      throw new Error("Isn't passenger's account");
    const activeRides = await this.rideDAO.getActiveRidesByPassengerId(passengerId
    );
    if (activeRides.length > 0)
      throw new Error("There active ride to this passeger");
    const ride = Ride.create(passengerId, from.lat, from.long, to.lat, to.long)
    await this.rideDAO.save(ride)
    return { rideId: ride.rideId };
  }
}

type Input = {
  passengerId: string,
	from: {
		lat: number,
		long: number
	},
	to: {
		lat: number,
		long: number
	}
}
