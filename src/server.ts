import axios from "axios";
import express from "express";
import { rateLimit } from "express-rate-limit";

const app = express();
const port: number = Number(process.env.PORT) || 3000;

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 2,
  standardHeaders: "draft-8",
});

app.use(limiter);

app.get("/{*any}", async (req, res) => {
  console.log("Request received");

  const calPath = decodeURIComponent(req.originalUrl.replace(/^\/+/, ""));

  if (
    !calPath.includes(
      "https://my.h-da.de:443/qisserver/pages/cm/exa/timetable/individualTimetableCalendarExport.faces?user=",
    )
  ) {
    res.status(400).send("Invalid calendar URL");
    return;
  }

  let parsed: URL;
  try {
    parsed = new URL(calPath);
  } catch (err) {
    res.status(400).send("Invalid calendar URL: unable to parse URL");
    return;
  }

  const user = parsed.searchParams.get("user");
  const hash = parsed.searchParams.get("hash");
  const termgroup = parsed.searchParams.get("termgroup");

  if (!user || user.trim() === "") {
    res.status(400).send("Missing or empty 'user' query parameter");
    return;
  }
  if (
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{20}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      user,
    )
  ) {
    res.status(400).send("Invalid 'user' query parameter");
    return;
  }
  if (!hash || hash.length < 20 || hash.length > 40) {
    res.status(400).send("Missing, empty or invalid 'hash' query parameter");
    return;
  }

  const result = await axios.get(calPath, {
    headers: {
      Accept: "text/html",
      "User-Agent":
        "Please fix your TimetableCalendarExport - h_daCalProxy/1.0.0 (+https://github.com/Vito0912/h_daCalProxy)",
      "X-Forwarded-For": req.ip,
    },
  });

  res.setHeader("Content-Type", "text/calendar");
  res.send(result.data);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
