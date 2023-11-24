// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "@/lib/mongodb";
import OldejHome from "@/models/OldejHome";

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
    if (req.query._id) {
      const id = Array.isArray(req.query._id) ? req.query._id[0] : req.query._id;
      const oneUser = await OldejHome.findById(id as string);
      if (oneUser == null) {
        res.status(404).json({ error: "User not found", success: false });
        return;
      }
      res.status(200).json({ oneUser, success: true });
    } else {
      const allOldejHome = await OldejHome.find();
      res.status(200).json({ allOldejHome, success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const createdOldejHome = await OldejHome.create({
      OldejHome: (req.body.OldejHome).toUpperCase(),
      notes: (req.body.notes).toUpperCase(),
    });
    res.status(201).json({ createdOldejHome, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const updatedOldejHome = await OldejHome.findByIdAndUpdate(req.body._id, {
      OldejHome: (req.body.OldejHome).toUpperCase(),
      notes: (req.body.notes).toUpperCase(),
    });
    res.status(200).json({ updatedOldejHome, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.query._id) {
      const id = Array.isArray(req.query._id) ? req.query._id[0] : req.query._id;
      const deleteOldejHome = await OldejHome.findOneAndDelete({ _id: id as string });
      if (deleteOldejHome == null) {
        res.status(404).json({ error: "Users not found", success: false });
        return;
      }
      res.status(200).json({ deleteOldejHome, success: true });
    } else {
      res.status(400).json({ error: "Please provide _id for deletion", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}
