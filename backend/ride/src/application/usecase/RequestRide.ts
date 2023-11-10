import Ride from "../../domain/Ride";
import RideRepository from "../repository/RideRepository";
import AccountGateway from "../gateway/AccountGateway";
import RepositoryFactory from "../factory/RepositoryFactory";

export default class RequestRide {
  rideRepository: RideRepository
  constructor(readonly repositoryFactory: RepositoryFactory, readonly accountGateway: AccountGateway) {
    this.rideRepository = repositoryFactory.createRideRepository()
  }

  async execute(input:Input) {
    const { accountId, from, to } = input;
    const account = await this.accountGateway.getById(accountId);
    if (!account?.isPassenger)
      throw new Error("Isn't passenger's account");
    const activeRides = await this.rideRepository.getActiveRidesByPassengerId(accountId);
    if (activeRides.length > 0)
      throw new Error("There active ride to this passeger");
    const ride = Ride.create(accountId, from.lat, from.long, to.lat, to.long)
    await this.rideRepository.save(ride)
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
