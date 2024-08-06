import { account } from "@/appwrite/appwrite";

export class Authentication {
	public async createSession({
		phone,
		password,
	}: {
		phone: string;
		password: string;
	}) {
		try {
			return await account.createEmailSession(phone, password);
		} catch (error) {
			throw error;
		}
	}

	public async isLoggedIn(): Promise<boolean> {
		try {
			const data = await this.getSession();
			return Boolean(data);
		} catch (error) {}
		return false;
	}

	public async getSession() {
		try {
			return account.get();
		} catch (error: any) {
			return null;
		}
	}

	public async logout() {
		try {
			return await account.deleteSession("current");
		} catch (error) {
			console.log("");
		}
	}
}

const AuthenticationService = new Authentication();
export default AuthenticationService;
