import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { message: "Not Authenticated", success: false },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        { message: "No messages found", success: false },
        { status: 401 }
      );
    }
    return Response.json(
      { message: "User Messages", success: true, messages: user[0].messages },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Error  while getting Messages for the user",
        success: false,
      },
      { status: 500 }
    );
  }
}
