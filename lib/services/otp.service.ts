import { functions } from "@/appwrite/appwrite";
import environment from "@/environments/environment";
const { appwriteGetVerifyOtpFunctionId } = environment;
export class Otp {
  public async getOtp({
    phone,
    type,
    intent = "GET",
  }: {
    phone: string;
    type: "VERIFICATION" | "FORGOT PASSWORD";
    intent?: "GET";
  }) {
    try {
      const { response } = await functions.createExecution(
        appwriteGetVerifyOtpFunctionId,
        JSON.stringify({ phone: phone, type: type, intent }),
        false
      );
      return JSON.parse(response);
    } catch (error) {
      throw error;
    }
  }

  public async verifyOtp({
    verificationKey,
    otp,
    check,
    intent = "VERIFY",
  }: {
    verificationKey: string;
    otp: string;
    check: string;
    intent?: "VERIFY";
  }) {
    try {
      const { response } = await functions.createExecution(
        appwriteGetVerifyOtpFunctionId,
        JSON.stringify({
          verificationKey: verificationKey,
          otp: otp,
          check: check,
          intent,
        })
      );
      return JSON.parse(response);
    } catch (error) {
      throw error;
    }
  }
}

const OtpService = new Otp();
export default OtpService;
