export default interface RideDAO {
  save(ride: any): Promise<void>;
  update(ride: any): Promise<void>;
  updatePosition(position: any): Promise<void>;
  getPositionByRideId(position: any): Promise<void>;
  finishRide(rideId: string): Promise<any>;
  getById(rideId: string): Promise<any>;
  getActiveRidesByPersonaId(type: string, personaId: string): Promise<any>;
}
