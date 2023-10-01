import AccountDAO from "../repository/AccountDAO";
import RideDAO from "../repository/RideDAO";

export default class AcceptRide {
  constructor (
    readonly rideDAO: RideDAO,
    readonly accountDAO: AccountDAO
  ) {}

  async execute (input: Input) {
    const { accountId, rideId } = input;
    const account = await this.accountDAO.getById(accountId);
    if (!account?.isDriver) throw new Error("Isn't driver's account");
    const ride = await this.rideDAO.getById(rideId);
    const activeRides = await this.rideDAO.getActiveRidesByDriverId(
      accountId
    );
    if (activeRides.length > 0)
      throw new Error("Driver already has an unfinished ride");
    ride.accept(accountId)
    await this.rideDAO.update(ride);
  }
}

type Input = {
  rideId: string,
  accountId: string
}