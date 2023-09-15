import axios from "axios"

test("Should create a passenger account", async () => {
  const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
  const responseSignup = await axios.post("http://localhost:3000/signup", input)
  const outputSignup = responseSignup.data;
  const responseAccount = await axios.get(`http://localhost:3000/account/${outputSignup.accountId}`)
  const outputGetAccount = responseAccount.data;
  console.log(outputGetAccount)
  expect(outputGetAccount.account_id).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
})