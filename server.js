import express from "express";
import vhost from "vhost";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Server = express();

const handleMultipleDomains = (domainName) => {
  const app = express();
  const root = path.join(__dirname, "website", domainName);

  app.get("*", (req, res) => {
    const filePath = path.join(root, "index.html");
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send("website not found0");
    }
  });

  return app;
};

const domains = JSON.parse(
  fs.readFileSync(path.join(__dirname, "domains.json"), "utf8")
);
domains.forEach((domain) => {
  Server.use(vhost(domain, handleMultipleDomains(domain)));
});
const port = 80;
Server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
