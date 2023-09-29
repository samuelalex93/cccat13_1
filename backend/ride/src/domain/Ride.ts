import crypto from "crypto";
import { RideStatus } from "../@types/RideStatus";

export default class Ride {
  driverId?: string;
	fare?: number ;
	distance?: number;


  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private status: string,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    readonly date: Date
  ) {}

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ) {
    const rideId = crypto.randomUUID();
    const status = RideStatus.Requested;
    const date = new Date();
    return new Ride(
      rideId,
      passengerId,
      status,
      fromLat,
      fromLong,
      toLat,
      toLong,
      date,
    );
  }

  static restore(
    rideId: string,
    passengerId: string,
    driverId: string,
    status: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    date: Date,
		fare: number,
		distance: number
  ) {
    const ride = new Ride(
      rideId,
      passengerId,
      status,
      fromLat,
      fromLong,
      toLat,
      toLong,
      date
    );
    ride.driverId = driverId;
    return ride;
  }

  accept(driverId: string) {
    if (this.status != RideStatus.Requested)
      throw new Error("Only rides with 'requested' status can be accepted");
    this.driverId = driverId;
    this.status = RideStatus.Accepted;
  }

  start() {
    if (this.status != RideStatus.Accepted)
      throw new Error("Only rides with 'accepted' status can be started");
    this.status = RideStatus.InProgress;
  }

  finish(fare: number, distance: number) {
    this.status = RideStatus.Completed;
		this.fare = fare
		this.distance = distance
  }

  cancel() {
    if (this.status == RideStatus.Canceled)
      throw new Error("Ride already canceled");
    this.status = RideStatus.Canceled;
  }

  getStatus() {
    return this.status;
  }
}