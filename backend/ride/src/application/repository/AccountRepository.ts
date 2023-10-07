import Account from "../../domain/Account";

export default interface AccountRepository {
  save (account: any): Promise<void>;
  getByEmail (email: string): Promise<Account | undefined>;
	getById (accountId: string): Promise<Account | undefined>;
	getByCPF (accountId: string): Promise<Account | undefined>;
}