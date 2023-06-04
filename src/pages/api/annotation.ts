import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "./socketio";

const annotation = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    // get message
    const message = req.body as string;

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("message", message);

    // return message
    res.status(201).json(message);
  }
};

export default annotation;
