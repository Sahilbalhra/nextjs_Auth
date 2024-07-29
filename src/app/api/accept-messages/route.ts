import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
      return Response.json(
        { message: "Not Aurthenticated", success: false },
        { status: 401 }
      );
    }

    const userId = user._id;

    const { acceptMessage } = await req.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          message: "failed to update user status to accept messages",
          success: false,
        },
        { status: 401 }
      );
    } else {
      return Response.json(
        {
          message: "Message Accepted",
          success: true,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return Response.json(
      { message: "Error while accepting message", success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
      return Response.json(
        { message: "Not Aurthenticated", success: false },
        { status: 401 }
      );
    }

    const userId = user._id;

    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
        message: "User Message Status",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Error  while getting  Accept Message status",
        success: false,
      },
      { status: 500 }
    );
  }
}
