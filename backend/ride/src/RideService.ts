import crypto from "crypto";
import AccountService from "./AccountService";
import Database from "./config/Database";

export enum RideStatus {
  Requested = "requested",
  Accepted = "accepted",
  InProgress = "in_progress",
  Completed = "completed",
  Canceled = "canceled",
}

export default class RideService {
  accountService: AccountService;
  constructor() {
    this.accountService = new AccountService();
  }

  /*
   *    deve verificar se o motorista já tem outra corrida com status "accepted" ou "in_progress", se tiver lançar um erro
   *    deve associar o driver_id na corrida
   *    deve mudar o status para "accepted" */

  async acceptRide(input: any) {
    const { accountId: driverId, rideId } = input;
    const dataDriver = await this.accountService.getAccount(driverId);
    if (!dataDriver.is_driver) throw new Error("Isn't driver's account");
    const dataRide = await this.getRide(rideId);
    if (dataRide.status != RideStatus.Requested)
      throw new Error(
        "Only rides with 'requested' status can is allow accepted"
      );
    const isAllCompletedRide = await this.isAllCompletedRide(
      "driver_id",
      driverId
    );
    if (!isAllCompletedRide)
      throw new Error("Driver already has an unfinished ride");
    const connection = Database.getConnection();
    try {
      await connection.query(
        "update cccat13.ride set driver_id=$1, status=$2 where ride_id=$3",
        [driverId, RideStatus.Accepted ,rideId]
      );
    } finally {
      await connection.$pool.end();
    }
  }

  async requestRide(input: any) {
    const { accountId: passengerId, from, to } = input;
    const dataPassenger = await this.accountService.getAccount(passengerId);
    if (!dataPassenger.is_passenger)
      throw new Error("Isn't passenger's account");
    const isAllCompletedRide = await this.isAllCompletedRide(
      "passenger_id",
      passengerId
    );
    if (!isAllCompletedRide)
      throw new Error("There active ride to this passeger");
    const rideId = crypto.randomUUID();
    const date = new Date();
    const connection = Database.getConnection();
    try {
      await connection.query(
        "insert into cccat13.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          rideId,
          passengerId,
          RideStatus.Requested,
          from.lat,
          from.long,
          to.lat,
          to.long,
          date,
        ]
      );
      return { rideId };
    } finally {
      await connection.$pool.end();
    }
  }

  async isAllCompletedRide(type: string, accountId: string) {
    const connection = Database.getConnection();
    const [{ count }] = await connection.query(
      `select count(*) from cccat13.ride where ${type} = $1 and status IN($2, $3)`,
      [
        accountId,
        RideStatus.Accepted,
        type == "driver_id" ? RideStatus.InProgress : RideStatus.Requested,
      ]
    );
    await connection.$pool.end();
    const allCompletedRide = count == 0 ? true : false;
    return allCompletedRide;
  }

  async getRide(rideId: string) {
    const connection = Database.getConnection();
    const [ride] = await connection.query(
      "select * from cccat13.ride where ride_id = $1",
      [rideId]
    );
    await connection.$pool.end();
    return ride;
  }
}
