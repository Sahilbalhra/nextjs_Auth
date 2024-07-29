import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user.model";
import { IMessage } from "@/model/user.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { message: "User Not found", success: false },
        { status: 404 }
      );
    }

    if (user.isAcceptingMessage) {
      return Response.json(
        { message: "User Not Accepting the Messages", success: false },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as IMessage);

    await user.save();

    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 401 }
    );
  } catch (error) {
    console.error("Unknown error ", error);
    return Response.json(
      { message: "Error While Saving Message", success: false },
      { status: 500 }
    );
  }
}
