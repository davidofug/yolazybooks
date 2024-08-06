import { functions } from "@/appwrite/appwrite";
import environment from "@/environments/environment";
const {
  appwriteUpdatePasswordFunctionId,
  appwriteListAdminsFunctionId,
  appwriteIsUserRegisteredCreateUserFunctionId,
} = environment;

export class Users {
  public async isUserRegistered({ phone }: { phone: string }) {
    try {
      const { response } = await functions.createExecution(
        appwriteIsUserRegisteredCreateUserFunctionId,
        JSON.stringify({ phone: phone, intent: "CHECK REGISTRATION STATUS" }),
        false
      );

      return JSON.parse(response);
    } catch (error) {
      throw error;
    }
  }

  public async listAdmins() {
    try {
      const { response } = await functions.createExecution(
        appwriteListAdminsFunctionId,
        JSON.stringify({}),
        false
      );

      return JSON.parse(response);
    } catch (error: any) {
      throw error;
    }
  }

  public async updatePassword({
    phone,
    password,
  }: {
    phone: string;
    password: string;
  }) {
    try {
      const { response } = await functions.createExecution(
        appwriteUpdatePasswordFunctionId,
        JSON.stringify({ phone: phone, password: password }),
        false
      );
      return JSON.parse(response);
    } catch (error) {
      throw error;
    }
  }

  public async createUser({
    phone,
    password,
    firstName,
  }: {
    phone: string;
    password: string;
    firstName: string;
  }) {
    try {
      const { response } = await functions.createExecution(
        appwriteIsUserRegisteredCreateUserFunctionId,
        JSON.stringify({
          phone: phone,
          password: password,
          firstName: firstName,
          intent: "CREATE USER",
        }),
        false
      );

      return JSON.parse(response);
    } catch (error) {
      throw error;
    }
  }
}

const UsersService = new Users();
export default UsersService;
