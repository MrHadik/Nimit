// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "@/lib/mongodb";
import Users from "@/models/Users";

connectMongoDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET":
        if (req.body.UserId) {
          const oneUser = await Users.findById(req.body.UserId);
          res.status(200).json({ oneUser, success: true });
        }
        const allUsers = await Users.find();
        res.status(200).json({ allUsers, success: true });
        break;

      case "POST":
        const userMedicine = await Users.create({
          grNumber: req.body.grNumber,
          name: req.body.name,
          oldejHome: req.body.oldejHome,
          isActive: req.body.isActive,
          medicines: req.body.medicines,
          notes: req.body.notes,
        });
        res.status(200).json({ userMedicine, success: true });
        break;

      case "PUT":
        const updatedUser = await Users.findByIdAndUpdate(req.body.UserId, req.body);
        res.status(200).json({ updatedUser, success: true });
        break;

      case "DELETE":
        const deletedUser = await Users.findOneAndDelete(req.body.UserId);
        res.status(200).json({ deletedUser, success: true });
        break;

      default:
        res.status(400).json({ error: "Method not allowed", success: false });
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}
