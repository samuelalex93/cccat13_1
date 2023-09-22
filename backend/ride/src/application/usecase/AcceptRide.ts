import { RideStatus } from "../../@types/RideStatus";
import AccountDAO from "../../AccountDAO";
import RideDAO from "../../RideDAO";

export default class AcceptRide {
  constructor (
    readonly rideDAO: RideDAO,
    readonly accountDAO: AccountDAO
  ) {}

  async execute (input: Input) {
    const { driverId, rideId } = input;
    const account = await this.accountDAO.getById(driverId);
    if (!account.isDriver) throw new Error("Isn't driver's account");
    const ride = await this.rideDAO.getById(rideId);
    if (ride.status != RideStatus.Requested)
      throw new Error(
        "Only rides with 'requested' status can be accepted"
      );
    const activeRides = await this.rideDAO.getActiveRidesByDriverId(
      driverId
    );
    if (activeRides.length > 0)
      throw new Error("Driver already has an unfinished ride");
    ride.accept(driverId)
    await this.rideDAO.update(ride);
  }
}

type Input = {
  rideId: string,
  driverId: string
}