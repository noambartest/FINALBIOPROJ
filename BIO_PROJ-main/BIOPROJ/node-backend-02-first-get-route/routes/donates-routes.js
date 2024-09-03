const express = require('express');

const controller = require('../controller/donates-controller');


const router = express.Router();

router.get("/", controller.getAllDonates);

router.get("/:btype", controller.getDonatesByBloodType);

router.patch("/:donateId", controller.updateDonate);

router.delete("/:donateId", controller.deleteDonate);

router.post("/", controller.createDonate);

router.get("/export/pdf", controller.exportToPDF);
router.get("/export/xml", controller.exportToXML);

module.exports = router;



