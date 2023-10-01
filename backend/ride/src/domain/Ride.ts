import crypto from "crypto";
import { RideStatus } from "../@types/RideStatus";
import DistanceCalculator from "./DistanceCalculator";
import Position from "./Position";

export default class Ride {
  driverId?: string;
	fare: number = 0;
	distance: number = 0;


  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private status: string,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    readonly date: Date,
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
		fare?: number,
		distance?: number
  ) {
    const ride = new Ride(
      rideId,
      passengerId,
      status,
      fromLat,
      fromLong,
      toLat,
      toLong,
      date,
    );
    ride.driverId = driverId;
    ride.fare = fare || 0;
    ride.distance = distance || 0;
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

  finish() {
    this.status = RideStatus.Completed;
  }

  cancel() {
    if (this.status == RideStatus.Canceled)
      throw new Error("Ride already canceled");
    this.status = RideStatus.Canceled;
  }

  getStatus() {
    return this.status;
  }

  calculateDistance(positions: Position[]) {
    let distance = 0
    for(let i = 1; i < positions.length; i++) {
      const from = {lat: positions[i-1].lat, long: positions[i-1].long}
      const to = {lat: positions[i].lat, long: positions[i].long}
      distance += DistanceCalculator.calculate(from, to) 
    }
    this.distance = distance
  }

  calculatePrice(){
    this.fare = 2.1 * this.distance
  }
}
