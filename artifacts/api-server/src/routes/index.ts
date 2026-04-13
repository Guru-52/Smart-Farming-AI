import { Router, type IRouter } from "express";
import healthRouter from "./health";
import farmingRouter from "./farming";

const router: IRouter = Router();

router.use(healthRouter);
router.use(farmingRouter);

export default router;
