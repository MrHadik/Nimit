import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "@/lib/mongodb";
import Users from "@/models/Users";
import generateUsersMedicinesPdf from '@/lib/createPDF'
import getName from '@/lib/getName'

connectMongoDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    const usersData = await Users.find();

    const oldejHome = getName('Ratanpar')
    const pdf = await generateUsersMedicinesPdf(usersData, oldejHome);
    const pdfBuffer = Buffer.from(pdf);
    res.setHeader('Content-Disposition', `attachment; filename="${oldejHome}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.status(200).end(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}
