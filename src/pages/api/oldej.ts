// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "@/lib/mongodb";
import Users from "@/models/Users";

connectMongoDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET":
        await handleGetRequest(req, res);
        break;

      case "POST":
        await handlePostRequest(req, res);
        break;

      case "PUT":
        await handlePutRequest(req, res);
        break;

      case "DELETE":
        await handleDeleteRequest(req, res);
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

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.query._id && req.query._id == undefined && req.query._id !== '' ) {
      const id = Array.isArray(req.query._id) ? req.query._id[0] : req.query._id;
      const oneUser = await Users.findById(id as string);
      if (oneUser == null) {
        res.status(404).json({ error: "User not found", success: false });
        return;
      }
      res.status(200).json({ oneUser, success: true });
    } else if (req.query.active === 'true') {
        const allUser = await Users.find({isActive: true});
        res.status(200).json({ allUser, success: true });
    } else if (req.query.active === 'false') {
      const allUser = await Users.find({isActive: false});
      res.status(200).json({ allUser, success: true });
    } else {
      const allUser = await Users.find();
      res.status(200).json({ allUser, success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const createdUsers = await Users.create({
      grNumber: (await Users.findOne().sort({ _id: -1 }))?.grNumber + 1 || 1,
      name: (req.body.name).toUpperCase(),
      oldejHome: (req.body.oldejHome).toUpperCase(),
      isActive: req.body.isActive,
      medicines: req.body.medicines,
      notes: (req.body.notes).toUpperCase(),
    });
    res.status(201).json({ createdUsers, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const updatedMedicine = await Users.findByIdAndUpdate(req.body._id,
      {
        name: (req.body.name).toUpperCase(),
        oldejHome: (req.body.oldejHome).toUpperCase(),
        isActive: req.body.isActive,
        medicines: req.body.medicines,
        notes: (req.body.notes).toUpperCase(),
      });
    res.status(200).json({ updatedMedicine, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.query._id) {
      const id = Array.isArray(req.query._id) ? req.query._id[0] : req.query._id;
      const deleteUsers = await Users.findOneAndDelete({ _id: id as string });
      if (deleteUsers == null) {
        res.status(404).json({ error: "Users not found", success: false });
        return;
      }
      res.status(200).json({ deleteUsers, success: true });
    } else {
      res.status(400).json({ error: "Please provide _id for deletion", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}
