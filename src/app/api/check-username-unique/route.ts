import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUp.schema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    console.log("result", result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
          success: false,
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existinfVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existinfVerifiedUser) {
      return Response.json(
        {
          message: "Username is already taken",
          success: false,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        message: "Username is unique",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      { message: "Error checking username", success: false },
      { status: 500 }
    );
  }
}
