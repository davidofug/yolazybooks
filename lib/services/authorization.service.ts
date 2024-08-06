import { teams } from "@/appwrite/appwrite";
import env from "@/environments/environment";

export class Authorization {
  public async checkIsAdmin(): Promise<boolean> {
    try {
      await teams.get(env.appwriteAdminTeamId);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async checkIsCustomer(): Promise<boolean> {
    try {
      await teams.get(env.appwriteCustomerTeamId);
      return true;
    } catch (error) {
      return false;
    }
  }

}

const AuthorizationService = new Authorization();
export default AuthorizationService;
