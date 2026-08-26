import { Router, type IRouter } from "express";
import healthRouter from "./health";
import summitRouter from "./summit";
import waitlistRouter from "./waitlist";

const router: IRouter = Router();

router.use(healthRouter);
router.use(summitRouter);
router.use(waitlistRouter);

export default router;
