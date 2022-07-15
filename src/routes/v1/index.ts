import { Router } from "express";
import * as handler from "./handlers";

const router = Router();

router.get("/menoraEvents", handler.getMenoraEvents);

export default router;
