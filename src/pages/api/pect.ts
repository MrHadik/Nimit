// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "@/lib/mongodb";
import Pect from "@/models/Pect";

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

      // case "PUT":
      //   await handlePutRequest(req, res);
      //   break;

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
      const records = await Pect.find().sort({ _id: -1 });
      const balance = records.reduce((sum, record) => sum + record.amount, 0)
      res.status(200).json({ records, balance, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const createdRecord = await Pect.create({
      date: req.body.date,
      message: req.body.message,
      amount: req.body.amount,
      lastBalance: req.body.lastBalance
    });
    res.status(201).json({ createdRecord, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.query._id) {
      const id = Array.isArray(req.query._id) ? req.query._id[0] : req.query._id;
      const deleteRecord = await Pect.findOneAndDelete({ _id: id as string });
      if (deleteRecord == null) {
        res.status(404).json({ error: "Record not found", success: false });
        return;
      }
      res.status(200).json({ deleteRecord, success: true });
    } else if (req.query.clear) {
      const deleteRecord = await Pect.deleteMany({});
      if (deleteRecord == null) {
        res.status(404).json({ error: "Record not found", success: false });
        return;
      }
      res.status(200).json({ deleteRecord, success: true });
    } else {
      res.status(400).json({ error: "Please provide _id for deletion", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}
