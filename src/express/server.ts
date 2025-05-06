import express, { Request, Response } from "express";
const app = express();
const port = 5000;

app.get("/api/options", (req: Request, res: Response) => {
  const mainOptions = [
    { id: "soil-testing", title: "Soil Testing", description: "Analyze your soil and get crop recommendations" },
    { id: "crop-advisory", title: "Crop Advisory", description: "Get advice on crop selection and management" },
    { id: "government-schemes", title: "Government Schemes", description: "Information on subsidies and support programs" },
    { id: "equipment-rental", title: "Equipment & Resources", description: "Access to farming equipment and resources" },
    { id: "expert-help", title: "Expert Assistance", description: "Connect with agricultural experts" },
  ];
  res.json(mainOptions);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
