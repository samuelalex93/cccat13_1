import AccountService from "../src/AccountService";
import RideService, { RideStatus } from "../src/RideService";
import Database from "../src/config/Database";

describe("RideSerive", () => {
  const createAccount = async (input: any) => {
    const accountService = new AccountService();
    return accountService.signup(input);
  };

  let passengerAccountId: string;
  let driverAccountId: string;

  beforeAll(async () => {
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

  beforeEach(async () => {
    const connection = Database.getConnection();
    await connection.query("delete from cccat13.ride");
    await connection.$pool.end();
  });

  describe("requestRide", () => {
    test("Should verify if account_id has is_passenger true", async () => {
      const input = {
        accountId: driverAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };

      const rideService = new RideService();
      await expect(() => rideService.requestRide(input)).rejects.toThrow(
        new Error("Isn't passenger's account")
      );
    });

    test("Should verify if there are not a active ride to passenger", async () => {
      const input = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };

      const rideService = new RideService();
      await rideService.requestRide(input);
      await expect(() => rideService.requestRide(input)).rejects.toThrow(
        new Error("There active ride to this passeger")
      );
    });

    test("Should generate rideId", async () => {
      const input = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };

      const rideService = new RideService();
      const { rideId } = await rideService.requestRide(input);
      expect(rideId).toBeDefined();
    });

    test("Should defined status 'requested'", async () => {
      const input = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };

      const rideService = new RideService();
      const output = await rideService.requestRide(input);
      const ride = await rideService.getRide(output.rideId);
      expect(ride.status).toBe(RideStatus.Requested);
    });
  });
  describe("acceptRide", () => {
    test("Should verify if account_id has is_driver true", async () => {
      const input = {
        accountId: passengerAccountId,
      };

      const rideService = new RideService();
      await expect(() => rideService.acceptRide(input)).rejects.toThrow(
        new Error("Isn't driver's account")
      );
    });

    test("Should verify if ride status is 'requested'", async () => {
      const input = {
        accountId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 },
      };

      const rideService = new RideService();
      const { rideId } = await rideService.requestRide(input);
      const connection = Database.getConnection();
      try {
        await connection.query(
          "update cccat13.ride set status = $1 where ride_id = $2",
          [RideStatus.Canceled, rideId]
        );
      } finally {
        await connection.$pool.end();
      }

      await expect(() =>
        rideService.acceptRide({ accountId: driverAccountId, rideId })
      ).rejects.toThrow(
        new Error("Only rides with 'requested' status can is allow accepted")
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
      const rideService = new RideService();
      const { rideId: firstRideId } = await rideService.requestRide(
        firstRideInput
      );
      await rideService.acceptRide({
        accountId: driverAccountId,
        rideId: firstRideId,
      });
      const { rideId: secondRideId } = await rideService.requestRide(
        secondRideInput
      );
      await expect(() =>
        rideService.acceptRide({
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
        const rideService = new RideService()
        const { rideId } = await rideService.requestRide(input)
        await rideService.acceptRide({ accountId: driverAccountId, rideId })
        const ride = await rideService.getRide(rideId)
        expect(ride.status).toBe(RideStatus.Accepted)
        expect(ride.driver_id).toBe(driverAccountId)
      })
  });
});
