// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(400).json({ error: "method not allowed", success: false });
  }

  if (req.body.username === process.env.LOGIN_USER && req.body.passwd === process.env.LOGIN_PASSWD ) {
    res.status(200).json({ token: process.env.NIMIT_LOGIN_TOKEN, success: true });
  } else {
    res.status(401).json({ error: "incorrect username or password", success: false });
  }
}
