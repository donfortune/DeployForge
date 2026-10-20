"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deploymentController_1 = __importDefault(require("../../controllers/deploymentController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', deploymentController_1.default.getAllDeployments);
router.post('/', deploymentController_1.default.createDeployment);
router.patch('/:id/status', deploymentController_1.default.updateStatus);
exports.default = router;
//# sourceMappingURL=deploymentRoutes.js.map