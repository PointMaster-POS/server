//get item by qr code

const express = require('express');
const qrCodeRouter = express.Router();

const {getItemByQRCode} = require('../controllers/qr-code');

//get item by qr code
//this route should be protected by the auth middleware cashier should be authenticated
qrCodeRouter.get('/item/:qrCode', getItemByQRCode);

module.exports = qrCodeRouter;