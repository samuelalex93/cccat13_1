import Account from "../../domain/Account";
import type HttpClient from "../http/HttpClient";
import type RideGateway from "./RideGateway";

export default class RideGatewayHttp implements RideGateway {
	
	constructor (readonly httpClient: HttpClient) {
	}

	async signup(input: Account): Promise<any> {
		const output = await this.httpClient.post("http://localhost:3000/signup", input);
		console.log(output)
		return output;
	}

	async requestRide(input: any): Promise<any> {
		const output = await this.httpClient.post("http://localhost:3000/request_ride", input);
		return output;
	}

	async getRide(rideId: string): Promise<any> {
		const output = await this.httpClient.get(`http://localhost:3000/rides/${rideId}`);
		return output;
	}
}