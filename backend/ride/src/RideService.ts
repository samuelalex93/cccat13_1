import crypto from "crypto";
import AccountService from "./AccountService";
import Database from "./config/Database";
import RideDAODatabase from "./RideDAODatabase";
import RideDAO from "./RideDAO";

export enum RideStatus {
  Requested = "requested",
  Accepted = "accepted",
  InProgress = "in_progress",
  Completed = "completed",
  Canceled = "canceled",
}

export default class RideService {
  accountService: AccountService;
  constructor(readonly rideDAO: RideDAO  = new RideDAODatabase()) {
    this.accountService = new AccountService();
  }

  /*
   *    deve verificar se o motorista já tem outra corrida com status "accepted" ou "in_progress", se tiver lançar um erro
   *    deve associar o driver_id na corrida
   *    deve mudar o status para "accepted" */

  async acceptRide(input: any) {
    const { accountId: driverId, rideId } = input;
    const dataDriver = await this.accountService.getAccount(driverId);
    if (!dataDriver.is_driver) throw new Error("Isn't driver's account");
    const dataRide = await this.getRide(rideId);
    if (dataRide.status != RideStatus.Requested)
      throw new Error(
        "Only rides with 'requested' status can be accepted"
      );
    const isAllCompletedRide = await this.isAllCompletedRide(
      "driver_id",
      driverId
    );
    if (!isAllCompletedRide)
      throw new Error("Driver already has an unfinished ride");
    dataRide.rideId = rideId
    dataRide.status = RideStatus.Accepted
    dataRide.driverId = driverId
    await this.rideDAO.update(dataRide);
  }

  async requestRide(input: any) {
    const { accountId: passengerId, from, to } = input;
    const dataPassenger = await this.accountService.getAccount(passengerId);
    if (!dataPassenger.is_passenger)
      throw new Error("Isn't passenger's account");
    const isAllCompletedRide = await this.isAllCompletedRide(
      "passenger_id",
      passengerId
    );
    if (!isAllCompletedRide)
      throw new Error("There active ride to this passeger");
    const rideId = crypto.randomUUID();
    const date = new Date();
    const ride = {
      rideId,
      passengerId,
      status: RideStatus.Requested,
      from,
      to,
      date
    }
    await this.rideDAO.save(ride)
    return { rideId };
  }

  async isAllCompletedRide(type: string, accountId: string) {
    const count = await this.rideDAO.getActiveRidesByPersonaId(type, accountId)
    const allCompletedRide = count == 0 ? true : false;
    return allCompletedRide;
  }

  async getRide(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
    return ride;
  }

  async startRide(rideId: any) {
    const ride = await this.rideDAO.getById(rideId)
    if(ride.status != RideStatus.Accepted) throw new Error("Only rides with 'accepted' status can be started")
    ride.status = RideStatus.InProgress;
    ride.rideId = ride.ride_id
    ride.driverId = ride.driver_id
    await this.rideDAO.update(ride)
  }

  async updatePosition(input: any) {
    const {rideId, lat, long} = input
    const ride = await this.getRide(rideId)
    if(ride.status != RideStatus.InProgress) throw new Error("Only rides with 'in_progress' status is accepted")
    const positionId = crypto.randomUUID();
    const position = {
      positionId,
      rideId,
      lat,
      long,
      date: new Date()
    }
    await this.rideDAO.updatePosition(position)
    return { positionId }
  }

  //   Ator: Motorista
  // Input: ride_id
  // Output: void
  // Deve verificar se a corrida está em status "in_progress", se não estiver lançar um erro
  // Deve obter todas as positions e calcular a distância entre cada uma delas, para isso utilize um algoritmo que receba duas coordenadas (lat, long) e retorne a distância entre elas em km.
  // Com a distância total calculada, calcule o valor da corrida (fare) multiplicando a distância por 2,1
  // Atualizar a corrida com o status "completed", a distância e o valor da corrida (fare)
  async finishRide(rideId: any) {
    const ride = await this.getRide(rideId)
    if(ride.status != RideStatus.InProgress) throw new Error("Only rides with 'in_progress' status is accepted")
    const inputPosition = await this.getPositionByRideId(rideId) as any
    const distance = this.getDistance(inputPosition)
    const fare = this.calculeteRideValue(distance)
    ride.rideId = ride.ride_id
    ride.status = RideStatus.Completed
    ride.fare = fare
    ride.distance = distance
    await this.rideDAO.finishRide(ride)
  }

  async getPositionByRideId(rideId: any) {
    const position = await this.rideDAO.getPositionByRideId(rideId) as any
    const from = {
      lat: position[0].lat,
      long: position[0].long
    }
    const to = {
      lat: position[position.length - 1].lat,
      long: position[position.length - 1].long
    }
    return {from, to}
  }

  getDistance(input: any) {
    const {from, lat} = input
    return 10;
  }

  calculeteRideValue(distance: number){
    return 2.1*distance
  }
}
