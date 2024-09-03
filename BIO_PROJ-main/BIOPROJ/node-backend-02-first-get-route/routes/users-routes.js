const express = require('express');

const controller = require('../controller/users-controllers');


const router = express.Router();

router.post("/create-admin", controller.createAdmin);

router.get("/getAllUsers", controller.getAllUsers);

router.post("/login", controller.login);

router.post("/signup", controller.signup);

router.patch("/updateRole", controller.updateRole);

module.exports = router;



