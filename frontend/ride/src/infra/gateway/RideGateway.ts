import Account from "../../domain/Account";

export default interface RideGateway {
	signup (input: Account): Promise<any>;
	requestRide (input: any): Promise<any>;
	getRide (rideId: string): Promise<any>;
}