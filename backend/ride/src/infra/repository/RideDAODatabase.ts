import { RideStatus } from "../../@types/RideStatus";
import RideDAO from "../../application/repository/RideDAO";
import Position from "../../domain/Position";
import Ride from "../../domain/Ride";
import Connection from "../database/Connection";

export default class RideDAODatabase implements RideDAO {

  constructor (readonly connection: Connection) {
	}
  
  async save(ride: Ride){        
    await this.connection.query(
      "insert into cccat13.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        ride.rideId,
        ride.passengerId,
        ride.getStatus(),
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.date,
      ]
    )
  }

  async update(ride: Ride){
    await this.connection.query(
      "update cccat13.ride set driver_id=$1, status=$2 where ride_id=$3",
      [ride.driverId, ride.getStatus() , ride.rideId]
    );
  };

  async finishRide(ride: Ride){
    console.log("finishride", ride)
    await this.connection.query(
      "update cccat13.ride set driver_id=$2, status=$3, distance=$4, fare=$5 where ride_id=$1",
      [ride.rideId, ride.driverId, ride.getStatus(), ride.distance, ride.fare]
    );
  };

  async savePosition(position: any){
    await this.connection.query(
      "insert into cccat13.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)",
      [position.positionId, position.rideId , position.lat, position.long, position.date]
    );
  };

  async getPositionByRideId(rideId: string){
    const positions = await this.connection.query(
      "select * from cccat13.position where ride_id = $1",
      [rideId]
    );

    return positions.map((position: any) => new Position(
      position.position_id, 
      position.ride_id,
      parseFloat(position.lat),
      parseFloat(position.long),
      position.date))
  };

  async getById(rideId: string){
    const [ride] = await this.connection.query(
      "select * from cccat13.ride where ride_id = $1",
      [rideId]
    );
		return Ride.restore(ride.ride_id, ride.passenger_id, ride.driver_id, ride.status, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.date, parseFloat(ride.fare), parseFloat(ride.distance));
  }
  
  async getActiveRidesByPersonaId(type: string, personaId: string){
    const [{ count }] = await this.connection.query(
      `select count(*) from cccat13.ride where ${type} = $1 and status IN($2, $3)`,
      [
        personaId,
        RideStatus.Accepted,
        type == "driver_id" ? RideStatus.InProgress : RideStatus.Requested,
      ]
    );
    return count
  }
  
  async getActiveRidesByDriverId(driverId: string){
    const ride = await this.connection.query(
      `select * from cccat13.ride where driver_id = $1 and status IN($2, $3)`,
      [
        driverId,
        RideStatus.Accepted,
        RideStatus.InProgress,
      ]
    );
    return ride
  }

  async getActiveRidesByPassengerId(passengerId: string){
    const ride = await this.connection.query(
      `select * from cccat13.ride where passenger_id = $1 and status IN($2, $3)`,
      [
        passengerId,
        RideStatus.Accepted,
        RideStatus.Requested,
      ]
    );
    return ride
  }
}