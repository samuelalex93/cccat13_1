import Ride from "../../domain/Ride";

export default interface RideRepository {
  save(ride: any): Promise<void>;
  update(ride: Ride): Promise<void>;
  finishRide(ride: Ride): Promise<void>;
  getById(rideId: string): Promise<Ride>;
  getActiveRidesByPersonaId(type: string, personaId: string): Promise<any>;
  getActiveRidesByDriverId(driverId: string): Promise<any>;
  getActiveRidesByPassengerId(passengerId: string): Promise<any>;
}
