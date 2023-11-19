// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "@/lib/mongodb";
import Medicine from "@/models/Medicine";

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
      const oneMedicine = await Medicine.findById(id as string);
      if (oneMedicine == null) {
        res.status(404).json({ error: "Medicine not found", success: false });
        return;
      }
      res.status(200).json({ oneMedicine, success: true });
    } else {
      const allMedicines = await Medicine.find();
      res.status(200).json({ Medicines: allMedicines, success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const createdMedicine = await Medicine.create({
      "medicineName": (req.body.medicineName).toUpperCase(),
      "isStar": req.body.isStar,
      "inStock": req.body.inStock,
      "notes": req.body.notes
    });
    res.status(201).json({ createdMedicine, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(req.body._id, req.body);
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
      const deletedMedicine = await Medicine.findOneAndDelete({ _id: id as string });
      if (deletedMedicine == null) {
        res.status(404).json({ error: "Medicine not found", success: false });
        return;
      }
      res.status(200).json({ deletedMedicine, success: true });
    } else {
      res.status(400).json({ error: "Please provide _id for deletion", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}
