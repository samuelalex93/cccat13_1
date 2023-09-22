import { RideStatus } from "./@types/RideStatus";
import RideDAO from "./RideDAO";
import Database from "./config/Database";

export default class RideDAODatabase implements RideDAO {
  async save(ride: any){    
    const connection = Database.getConnection();
    await connection.query(
      "insert into cccat13.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        ride.rideId,
        ride.passengerId,
        ride.status,
        ride.from.lat,
        ride.from.long,
        ride.to.lat,
        ride.to.long,
        ride.date,
      ]
    )
    await connection.$pool.end()
  }

  async update(ride: any){
    const connection = Database.getConnection();
    await connection.query(
      "update cccat13.ride set driver_id=$1, status=$2 where ride_id=$3",
      [ride.driverId, ride.status , ride.rideId]
    );
    await connection.$pool.end()
  };

  async finishRide(ride: any){
    const connection = Database.getConnection();
    await connection.query(
      "update cccat13.ride set driver_id=$1, status=$2 where ride_id=$3, distance=$4, fare=$5",
      [ride.driverId, ride.status , ride.rideId, ride.distance, ride.fare]
    );
    await connection.$pool.end()
  };

  async updatePosition(position: any){
    const connection = Database.getConnection();
    await connection.query(
      "insert into cccat13.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)",
      [position.positionId, position.rideId , position.lat, position.long, position.date]
    );
    await connection.$pool.end()
  };

  async getPositionByRideId(rideId: any){
    const connection = Database.getConnection();
    const [position] = await connection.query(
      "select * from cccat13.position where ride_id = $1",
      [rideId]
    );
    await connection.$pool.end()
    return position
  };

  async getById(rideId: string){
    const connection = Database.getConnection();
    const [ride] = await connection.query(
      "select * from cccat13.ride where ride_id = $1",
      [rideId]
    );
    await connection.$pool.end()
    return ride
  }
  async getActiveRidesByPersonaId(type: string, personaId: string){
    const connection = Database.getConnection();
    const [{ count }] = await connection.query(
      `select count(*) from cccat13.ride where ${type} = $1 and status IN($2, $3)`,
      [
        personaId,
        RideStatus.Accepted,
        type == "driver_id" ? RideStatus.InProgress : RideStatus.Requested,
      ]
    );
    await connection.$pool.end();
    return count
  }
  
  async getActiveRidesByDriverId(driverId: string){
    const connection = Database.getConnection();
    const [ride] = await connection.query(
      `select * from cccat13.ride where driver_id = $1 and status IN($2, $3)`,
      [
        driverId,
        RideStatus.Accepted,
        RideStatus.InProgress,
      ]
    );
    await connection.$pool.end();
    return ride
  }

  async getActiveRidesByPassengerId(passengerId: string){
    const connection = Database.getConnection();
    const [ride] = await connection.query(
      `select * from cccat13.ride where driver_id = $1 and status IN($2, $3)`,
      [
        passengerId,
        RideStatus.Accepted,
        RideStatus.Requested,
      ]
    );
    await connection.$pool.end();
    return ride
  }
}
