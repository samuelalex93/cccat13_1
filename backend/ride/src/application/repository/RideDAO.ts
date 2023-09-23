import Ride from "../../domain/Ride";

export default interface RideDAO {
  save(ride: any): Promise<void>;
  update(ride: Ride): Promise<void>;
  updatePosition(position: any): Promise<void>;
  getPositionByRideId(position: any): Promise<any>;
  finishRide(ride: Ride): Promise<void>;
  getById(rideId: string): Promise<Ride>;
  getActiveRidesByPersonaId(type: string, personaId: string): Promise<any>;
  getActiveRidesByDriverId(driverId: string): Promise<any>;
  getActiveRidesByPassengerId(passengerId: string): Promise<any>;
}
