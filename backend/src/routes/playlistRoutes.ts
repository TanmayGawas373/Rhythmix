import { Router } from "express";
import { PlaylistController } from "../controllers/PlayListController";

const router = Router();

router.get("/current", PlaylistController.getCurrent);
router.get("/next", PlaylistController.next);
router.get("/previous", PlaylistController.previous);

router.post("/queue/:id", PlaylistController.enqueue);

router.get("/search/:id", PlaylistController.search);

router.delete("/remove", PlaylistController.removeCurrent);

router.get("/", PlaylistController.getPlaylist);
router.get("/queue", PlaylistController.getQueue);
router.get("/history", PlaylistController.getHistory);

router.delete("/queue/:index", PlaylistController.removeFromQueue);

router.put("/queue/reorder", PlaylistController.reorderQueue);

export default router;