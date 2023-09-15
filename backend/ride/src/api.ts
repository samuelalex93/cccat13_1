import express from "express";
import AccountService from "./AccountService";

const app = express()
app.use(express.json())
const accountService = new AccountService()

app.post("/signup", async function (req, res) {
  const input = req.body;
  const output = await accountService.signup(input)
  res.json(output)
})

app.get("/account/:accountId", async function (req, res) {
  const output = await accountService.getAccount(req.params.accountId)
  res.json(output)
})


app.listen(3000)