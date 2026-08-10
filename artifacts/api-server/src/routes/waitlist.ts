import { Router } from "express";

const router = Router();

router.post("/waitlist", async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }

  const apiKey = process.env["FILLOUT_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "Server misconfiguration." });
    return;
  }

  const filloutRes = await fetch(
    "https://api.fillout.com/v1/api/forms/vrn4oMRfTqus/submissions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        submissions: [
          { questions: [{ id: "vAM4", name: "Email", type: "EmailInput", value: email }] },
        ],
      }),
    }
  );

  if (!filloutRes.ok) {
    const body = await filloutRes.text();
    res.status(502).json({ error: "Submission failed.", detail: body });
    return;
  }

  res.json({ ok: true });
});

export default router;
