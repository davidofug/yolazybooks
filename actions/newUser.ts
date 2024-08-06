"use server";
import { env } from "process";
import { ID } from "node-appwrite";

const sdk = require("node-appwrite");
import { UserInterface } from "@/types/user.interface";

const client = new sdk.Client()
	.setEndpoint(env.appwriteUrl) // Your API Endpoint
	.setProject(env.appwriteProjectId) // Your project ID
	.setKey(env.appwriteApiKey); // Your secret API key

const users = new sdk.Users(client);

export const registerUser = async (data: UserInterface): Promise<any> => {
	console.log(data);
	const { email, password } = data;
	if (!email || email === "" || !password || password === "") {
		return "Email and password required!";
	}

	const result = await users.create(
		ID.unique(), // userId
		email, // email (optional)
		"", // phone (optional)
		password, // password (optional)
		"" // name (optional)
	);

	console.log(result);
};
