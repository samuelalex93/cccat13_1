//import AccountService from "../src/AccountService";
import { RideStatus } from "../src/@types/RideStatus";
import AcceptRide from "../src/application/usecase/AcceptRide";
import CancelRide from "../src/application/usecase/CancelRide";
import FinishRide from "../src/application/usecase/FinishRide";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import Signup from "../src/application/usecase/Signup";
import StartRide from "../src/application/usecase/StartRide";
import UpdatePosition from "../src/application/usecase/UpdatePosition";
import Connection from "../src/infra/database/Connection";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import AccountDAODatabase from "../src/infra/repository/AccountDAODatabase";
import RideDAODatabase from "../src/infra/repository/RideDAODatabase";

let signup: Signup;
let connection: Connection;
let accountDAO: AccountDAODatabase;
let rideDAO: RideDAODatabase;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let cancelRide: CancelRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;

describe("RideSerive", () => {
  let passengerAccountId: string;
  let driverAccountId: string;

  beforeAll(async () => {
    connection = new PgPromiseAdapter();
    accountDAO = new AccountDAODatabase(connection);
    rideDAO = new RideDAODatabase(connection);
    signup = new Signup(accountDAO);
    requestRide = new RequestRide(rideDAO, accountDAO);
    getRide = new GetRide(rideDAO);
    acceptRide = new AcceptRide(rideDAO, accountDAO);
    cancelRide = new CancelRide(rideDAO);
    startRide = new StartRide(rideDAO);
    finishRide = new FinishRide(rideDAO);
    updatePosition = new UpdatePosition(rideDAO);
    //getAccount = new GetAccount(accountDAO);

    const { accountId: passengerId } = await createAccount({
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "95818705552",
      isPassenger: true,
    });
    const { accountId: driverId } = await createAccount({
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "95818705552",
      isPassenger: false,
      isDriver: true,
      carPlate: "AAA9999",
    });

    passengerAccountId = passengerId;
    driverAccountId = driverId;
  });

  const createAccount = async (input: any) => {
    return signup.execute(input);
  };

  beforeEach(async () => {
    await connection.query("delete from cccat13.ride", "");
  });

  describe("requestRide", () => {
    test("Should verify if account_id has is_passenger true", async () => {
      const input: any = {
        accountId: driverAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };
      await expect(() => requestRide.execute(input)).rejects.toThrow(
        new Error("Isn't passenger's account")
      );
    });

    test("Should verify if there are not a active ride to passenger", async () => {
      const input: any = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };
      await requestRide.execute(input);
      await expect(() => requestRide.execute(input)).rejects.toThrow(
        new Error("There active ride to this passeger")
      );
    });

    test("Should generate rideId", async () => {
      const input = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };
      const { rideId } = await requestRide.execute(input);
      expect(rideId).toBeDefined();
    });

    test("Should defined status 'requested'", async () => {
      const input = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };

      const output = await requestRide.execute(input);
      const ride = await getRide.execute(output.rideId);
      expect(ride.getStatus()).toBe(RideStatus.Requested);
    });
  });
  describe("acceptRide", () => {
    test("Should verify if account_id has is_driver true", async () => {
      const input: any = {
        accountId: passengerAccountId,
      };

      await expect(() => acceptRide.execute(input)).rejects.toThrow(
        new Error("Isn't driver's account")
      );
    });

    test("Should verify if ride status is 'requested'", async () => {
      const input = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };

      const { rideId } = await requestRide.execute(input);

      await cancelRide.execute({ rideId })

      await expect(() =>
        acceptRide.execute({ accountId: driverAccountId, rideId })
      ).rejects.toThrow(
        new Error("Only rides with 'requested' status can be accepted")
      );
    });

    test("Should verify if driver alread has another ride with status 'accepted' or 'in_progress'", async () => {
      const { accountId: newPassengerId } = await createAccount({
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isPassenger: true,
      });
      const firstRideInput = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };
      const secondRideInput = {
        accountId: newPassengerId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };
      const { rideId: firstRideId } = await requestRide.execute(
        firstRideInput
      );
      await acceptRide.execute({
        accountId: driverAccountId,
        rideId: firstRideId,
      });
      const { rideId: secondRideId } = await requestRide.execute(
        secondRideInput
      );
      await expect(() =>
        acceptRide.execute({
          accountId: driverAccountId,
          rideId: secondRideId,
        })
      ).rejects.toThrow(new Error("Driver already has an unfinished ride"));
    });

    test('Should allow a driver to accept a ride', async () => {
        const input = {
          accountId: passengerAccountId,
          from: { lat: 0, long: 0 },
          to: { lat: 0, long: 0 }
        }
        const { rideId } = await requestRide.execute(input)
        await acceptRide.execute({ accountId: driverAccountId, rideId })
        const ride = await getRide.execute(rideId)
        expect(ride?.getStatus()).toBe(RideStatus.Accepted)
        expect(ride?.driverId).toBe(driverAccountId)
      })
  });
  describe("startRide", () =>{
    test("Should verify if ride is with status 'accepted'", async()=>{
      const input = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };
    
      const { rideId } = await requestRide.execute(input)
      await expect(()=>startRide.execute(rideId)).rejects.toThrow(new Error("Only rides with 'accepted' status can be started"))
    })
    test("Should change status ride to 'in_progress'", async()=>{
      const input = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };
      const { rideId } = await requestRide.execute(input)
      await acceptRide.execute({accountId: driverAccountId, rideId})
      await startRide.execute(rideId)
      const ride = await getRide.execute(rideId)
      expect(ride?.getStatus()).toBe(RideStatus.InProgress)
    })
  })

  describe("updatePosition", () =>{
    test("Should verify if ride is with status 'in_progress'", async()=>{
      const inputRide = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };
      const { rideId } = await requestRide.execute(inputRide)

      const inputPosition = {
        rideId,
        lat: 0,
        long: 0
      }
      await expect(()=> updatePosition.execute(inputPosition)).rejects.toThrow(new Error("Only rides with 'in_progress' status is accepted"))
    })

    test.only("Should create position_id", async()=>{
      const inputRide = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };
      const { rideId } = await requestRide.execute(inputRide)
      await acceptRide.execute({accountId: driverAccountId, rideId})
      await startRide.execute(rideId)

      const inputPosition = {
        rideId,
        lat: 0,
        long: 0
      }

      const positionId = await updatePosition.execute(inputPosition)
      expect(positionId).toBeDefined()
    })
  })

  describe("finishRide", () =>{
    test.only("Should verify id ride is with status 'in_progress'", async()=>{
      const inputRide = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };
      const { rideId } = await requestRide.execute(inputRide)

      await expect(()=>finishRide.execute(rideId)).rejects.toThrow(new Error("Only rides with 'in_progress' status is accepted"))
    })
  })

  afterAll(async() => {
    await connection.close();
  })
});
