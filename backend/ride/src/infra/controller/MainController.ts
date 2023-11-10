import GetRide from "../../application/usecase/GetRide";
import RequestRide from "../../application/usecase/RequestRide";
import inject from "../di/Inject";
import Registry from "../di/Registry";
import HttpServer from "../http/HttpServer";
import Queue from "../queue/Queue";

export default class MainController {
  @inject("requestRide")
	requestRide?: RequestRide;
	@inject("getRide")
	getRide?: GetRide;
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("queue")
	queue?: Queue
  constructor(){
    this.httpServer?.on("post", "/request_ride", async function (params: any, body: any) {
			console.log(body);
			const output = await Registry.getInstance().inject("requestRide").execute(body);
			return output;
		});
    this.httpServer?.on("post", "/request_ride_async", async (params: any, body: any) => {
			await this.queue?.publish("requestRide", body);
		});
		this.httpServer?.on("get", "/rides/:rideId", async function (params: any, body: any) {
			console.log(params.rideId);
			const output = await Registry.getInstance().inject("getRide").execute(params.rideId);
			return output;
		});
  }

}