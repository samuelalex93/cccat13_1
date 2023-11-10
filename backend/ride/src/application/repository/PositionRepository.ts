import Position from "../../domain/Position";

export default interface PositionRepository {
  savePosition(position: any): Promise<void>;
  getPositionByRideId(rideId: string): Promise<Position[]>;
}