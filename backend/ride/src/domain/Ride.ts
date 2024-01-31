import crypto from "crypto";
import { RideStatus } from "../@types/RideStatus";
import DistanceCalculator from "./DistanceCalculator";
import Position from "./Position";
import Coord from "./Coord";
import { FareCalculatorFactory } from "./FareCalculate";

export default class Ride {
  driverId?: string;

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private status: string,
    readonly from: Coord,
    readonly to: Coord,
    readonly date: Date,
    private distance: number,
    private fare: number
  ) {}

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ) {
    const rideId = crypto.randomUUID();
    const status = RideStatus.Requested;
    const date = new Date();
    return new Ride(
      rideId,
      passengerId,
      status,
      new Coord(fromLat, fromLong),
      new Coord(toLat, toLong),
      date,
      0,
      0
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
      new Coord(fromLat, fromLong),
      new Coord(toLat, toLong),
      date,
      distance,
      fare
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
    let distance = 0;
    for (let i = 1; i < positions.length; i++) {
      const from = { lat: positions[i - 1].coord.getLat(), long: positions[i - 1].coord.getLong() };
      const to = { lat: positions[i].coord.getLat(), long: positions[i].coord.getLong() };
      distance += DistanceCalculator.calculate(new Coord(from.lat, from.long), new Coord(to.lat, to.long));
    }
    this.distance = distance;
  }

  calculatePrice() {
    const fareCalculator = FareCalculatorFactory.create(this.date)
    this.fare = fareCalculator.calculate(this.distance)
  }

  getDistance(){
    return this.distance
  }

  getFare(){
    return this.fare
  }
}
