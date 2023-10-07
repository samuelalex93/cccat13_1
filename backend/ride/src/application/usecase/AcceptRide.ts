import AccountRepository from "../repository/AccountRepository";
import RideRepository from "../repository/RideRepository";

export default class AcceptRide {
  constructor (
    readonly rideRepository: RideRepository,
    readonly accountRepository: AccountRepository
  ) {}

  async execute (input: Input) {
    const { accountId, rideId } = input;
    const account = await this.accountRepository.getById(accountId);
    if (!account?.isDriver) throw new Error("Isn't driver's account");
    const ride = await this.rideRepository.getById(rideId);
    const activeRides = await this.rideRepository.getActiveRidesByDriverId(
      accountId
    );
    if (activeRides.length > 0)
      throw new Error("Driver already has an unfinished ride");
    ride.accept(accountId)
    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string,
  accountId: string
}