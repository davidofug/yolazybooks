const environment = {
	appwriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_URL),
	appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
	appwriteAdminTeamId: String(process.env.NEXT_PUBLIC_APPWRITE_ADMIN_TEAM_ID),
	appwriteCustomerTeamId: String(
		process.env.NEXT_PUBLIC_APPWRITE_CUSTOMER_TEAM_ID
	),
	serverBaseUrl: String(process.env.NEXT_PUBLIC_SERVER_BASE_URL),
	localServerUrl: String(process.env.NEXT_PUBLIC_LOCAL_SERVER_BASE_URL),
	appwriteDatabaseId: String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
	appwriteCategoriesCollectionId: String(
		process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID
	),
	appwriteBusinessesCollectionId: String(
		process.env.NEXT_PUBLIC_APPWRITE_BUSINESSES_COLLECTION_ID
	),
	appwritePayeeCollectionId: String(
		process.env.NEXT_PUBLIC_APPWRITE_PAYEE_COLLECTION_ID
	),
	appwriteProfilesCollectionId: String(
		process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID
	),
	appwriteContributionsCollectionId: String(
		process.env.NEXT_PUBLIC_APPWRITE_CONTRIBUTIONS_COLLECTION_ID
	),
	appwriteUpdatePasswordFunctionId: String(
		process.env.NEXT_PUBLIC_APPWRITE_UPDATE_PASSWORD_FUNCTION_ID
	),
	appwriteIsUserRegisteredCreateUserFunctionId: String(
		process.env
			.NEXT_PUBLIC_APPWRITE_IS_USER_REGISTERED_CREATE_USER_FUNCTION_ID
	),
};

export default environment;
