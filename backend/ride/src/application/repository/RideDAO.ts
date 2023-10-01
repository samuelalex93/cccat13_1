import Position from "../../domain/Position";
import Ride from "../../domain/Ride";

export default interface RideDAO {
  save(ride: any): Promise<void>;
  update(ride: Ride): Promise<void>;
  savePosition(position: any): Promise<void>;
  getPositionByRideId(rideId: string): Promise<Position[]>;
  finishRide(ride: Ride): Promise<void>;
  getById(rideId: string): Promise<Ride>;
  getActiveRidesByPersonaId(type: string, personaId: string): Promise<any>;
  getActiveRidesByDriverId(driverId: string): Promise<any>;
  getActiveRidesByPassengerId(passengerId: string): Promise<any>;
}
