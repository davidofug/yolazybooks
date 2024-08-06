import { functions } from "@/appwrite/appwrite";
import environment from "@/environments/environment";
const { appwriteSendMessageFunctionId } = environment;
import { Users } from "./users.service";

export class Messaging {
  private usersService;
  constructor() {
    this.usersService = new Users();
  }
  public async sendMessage({
    phone,
    message,
  }: {
    phone: string;
    message: string;
  }) {
    try {
      return functions.createExecution(
        appwriteSendMessageFunctionId,
        JSON.stringify({ phone: phone, message: message }),
        true
      );
    } catch (error) {
      throw error;
    }
  }

  public async NotifyAdmins(messagebody: string) {
    try {
      const { admins } = await this.usersService.listAdmins();
      await admins.forEach(
        async ({
          phoneNumber,
          firstName,
        }: {
          phoneNumber: string;
          firstName: string | null;
        }) => {
          const message: string = `Hey ${
            firstName ?? "Admin,"
          }\n${messagebody}`;

          const response = await this.sendMessage({
            phone: phoneNumber,
            message: message,
          });
          console.log("Response: ", response);
        }
      );
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  }
}

const MessageService = new Messaging();
export default MessageService;
