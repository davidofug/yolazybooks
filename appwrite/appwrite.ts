import env from "@/environments/environment";
import {
	Client,
	Account,
	Databases,
	Storage,
	Teams,
	Functions,
} from "appwrite";

const appwriteClient = new Client()
	.setEndpoint(env.appwriteUrl)
	.setProject(env.appwriteProjectId);

const account = new Account(appwriteClient);
const database = new Databases(appwriteClient);
const teams = new Teams(appwriteClient);
const functions = new Functions(appwriteClient);

export { account, database, teams, functions, appwriteClient };
