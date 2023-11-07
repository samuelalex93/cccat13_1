import AccountRepository from "../src/application/repository/AccountRepository";
import GetAccount from "../src/application/usecase/GetAccount";
import Signin from "../src/application/usecase/Signin";
import Signup from "../src/application/usecase/Signup";
import Connection from "../src/infra/database/Connection";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";

let signup: Signup;
let signin: Signin;
let getAccount: GetAccount;
let connection: Connection;
let accountRepository: AccountRepository;

beforeEach(function () {
  connection = new PgPromiseAdapter();
  accountRepository = new AccountRepositoryDatabase(connection);
  signup = new Signup(accountRepository);
  signin = new Signin(accountRepository);
  getAccount = new GetAccount(accountRepository);
});

afterEach(async () => {
  await connection.close();
});

test("Deve criar um passageiro", async function () {
  const input: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
    password: "senha123",
  };
  const output = await signup.execute(input);
  const account = await getAccount.execute(output.accountId);
  expect(account?.accountId).toBeDefined();
  expect(account?.name).toBe(input.name);
  expect(account?.email).toBe(input.email);
  expect(account?.cpf).toBe(input.cpf);
});

test("Não deve criar um passageiro com cpf inválido", async function () {
  const input: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705500",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid cpf")
  );
});

test("Não deve criar um passageiro com nome inválido", async function () {
  const input: any = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid name")
  );
});

test("Não deve criar um passageiro com email inválido", async function () {
  const input: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@`,
    cpf: "95818705552",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid email")
  );
});

test("Não deve criar um passageiro com conta existente", async function () {
  const input: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
  };
  await signup.execute(input);
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Account already exists")
  );
});

test("Deve criar um motorista", async function () {
  const input: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    carPlate: "AAA9999",
    isDriver: true,
    password: "senha123",
  };
  const output = await signup.execute(input);
  expect(output.accountId).toBeDefined();
});

test("Não deve criar um motorista com place do carro inválida", async function () {
  const input: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    carPlate: "AAA999",
    isDriver: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid plate")
  );
});

test("Não deve fazer login com cpf inexistente", async function () {
  const input: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705554",
    carPlate: "AAA9999",
    isDriver: true,
    password: "senha123",
  };
  
  await expect(() =>
    signin.execute({ cpf: input.cpf, password: input.password, date: new Date() })
  ).rejects.toThrow(new Error("There no any account with this CPF"));
});

test("Não deve fazer login com senha incorreta", async function () {
  const input: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    carPlate: "AAA9999",
    isDriver: true,
    password: "senha123",
  };
  await signup.execute(input);
  await expect(() =>
    signin.execute({ cpf: input.cpf, password: "senha12" , date: new Date()})
  ).rejects.toThrow(new Error("Authentication failed"));
});

test("Deve fazer login", async function () {
  const input: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    carPlate: "AAA9999",
    isDriver: true,
    password: "senha123",
  };
  await signup.execute(input);
  const outputSignin = await signin.execute({
    cpf: input.cpf,
    password: input.password,
    date: new Date()
  });
  expect(outputSignin.token).toBeDefined();
});
