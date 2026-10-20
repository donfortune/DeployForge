import userController from "../../controllers/userController";
import { Router } from "express";

const router = Router();

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);

export default router;