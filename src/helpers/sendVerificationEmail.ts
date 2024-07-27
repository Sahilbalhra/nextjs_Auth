import { resend } from "@/lib/resed";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "Verification Email Send Successfully" };
  } catch (error) {
    console.error("Error while sending Email", error);
    return { success: false, message: "Failed To Send Verification Email" };
  }
};
