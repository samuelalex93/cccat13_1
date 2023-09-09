import pgp from "pg-promise";

export default class Database {
	static getConnection() {
		return pgp()("postgres://postgres:123456@localhost:5432/postgres");
	}
}