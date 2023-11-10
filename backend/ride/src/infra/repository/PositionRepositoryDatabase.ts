import PositionRepository from "../../application/repository/PositionRepository";
import Coord from "../../domain/Coord";
import Position from "../../domain/Position";
import Connection from "../database/Connection";

export default class PositionRepositoryDatabase implements PositionRepository {

	constructor (readonly connection: Connection) {
	}
  
  async savePosition(position: any) {
    await this.connection.query(
      "insert into cccat13.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)",
      [
        position.positionId,
        position.rideId,
        position.lat,
        position.long,
        position.date,
      ]
    );
  }

  async getPositionByRideId(rideId: string) {
    const positions = await this.connection.query(
      "select * from cccat13.position where ride_id = $1",
      [rideId]
    );

    return positions.map(
      (position: any) =>
        new Position(
          position.position_id,
          position.ride_id,
          new Coord(parseFloat(position.lat), parseFloat(position.long)),
          position.date
        )
    );
  }
}
