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
  appwriteThirdPartyCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_THIRDPARTY_COLLECTION_ID
  ),
  appwriteGarageCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_GARAGES_COLLECTION_ID
  ),
  appwriteServicesCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_SERVICES_COLLECTION_ID
  ),
  appwriteCarTypesCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_CAR_TYPES_COLLECTION_ID
  ),
  appwriteProfilesCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID
  ),
  appwriteGarageServicesCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_GARAGE_SERVICES_COLLECTION_ID
  ),
  appwriteContactPersonsCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_CONTACT_PERSONS_COLLECTION_ID
  ),
  appwritePlacesCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_PLACES_COLLECTION_ID
  ),
  appwriteVehiclesCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_VEHICLES_COLLECTION_ID
  ),
  appwriteGarageNetworkJoinRequestCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_GARAGE_NETWORK_JOIN_REQUEST_COLLECTION_ID
  ),
  googleMapsApiKey: String(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
  appwriteGarageLogosBucketId: String(
    process.env.NEXT_PUBLIC_APPWRITE_GARAGE_LOGOS_BUCKET_ID
  ),
  appwriteVehicleBucketId: String(
    process.env.NEXT_PUBLIC_APPWRITE_VEHICLE_BUCKET_ID
  ),
  appwriteBookingsCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID
  ),
  appwriteRatingsCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_RATINGS_COLLECTION_ID
  ),
  appwriteDistrictAreasCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_DISTRICT_AREAS_COLLECTION_ID
  ),
  appwriteUpdatePasswordFunctionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_UPDATE_PASSWORD_FUNCTION_ID
  ),
  appwriteSendMessageFunctionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_SEND_MESSAGE_FUNCTION_ID
  ),
  appwriteListAdminsFunctionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_LIST_ADMINS_FUNCTION_ID
  ),
  appwriteGetVerifyOtpFunctionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_GET_VERIFY_OTP_FUNCTION_ID
  ),
  appwriteIsUserRegisteredCreateUserFunctionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_IS_USER_REGISTERED_CREATE_USER_FUNCTION_ID
  ),
};

export default environment;
