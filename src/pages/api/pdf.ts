import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "@/lib/mongodb";
import Users from "@/models/Users";
import generateUsersMedicinesPdf from '@/lib/createPDF'
import getName from '@/lib/getName'

connectMongoDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      res.status(400).json({ error: "method not allowed", success: false });
      return; // Ensure to return after sending the response
    }

    if (req.query.oldejHome && req.query.oldejHome !== '') {
      const oldejHomeName = Array.isArray(req.query.oldejHome) ? req.query.oldejHome[0] : req.query.oldejHome;
      const usersData = await Users.find({ isActive: true, oldejHome: oldejHomeName });

      if (usersData && usersData.length !== 0) {
        const oldejHome = getName(oldejHomeName);
        const pdf = await generateUsersMedicinesPdf(usersData, oldejHome);
        const pdfBuffer = Buffer.from(pdf);

        res.setHeader('Content-Disposition', `attachment; filename="${oldejHome}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.status(200).end(pdfBuffer);
        return; // Ensure to return after sending the response
      }

      res.status(400).json({ error: "Oldej Home Not Found!", success: false });
      return; // Ensure to return after sending the response
    }

    const usersData = await Users.find({ isActive: true });
    const oldejHome = getName("All Users");
    const pdf = await generateUsersMedicinesPdf(usersData, oldejHome);
    const pdfBuffer = Buffer.from(pdf);

    res.setHeader('Content-Disposition', `attachment; filename="${oldejHome}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.status(200).end(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: true });
  }
}
