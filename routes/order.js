const express = require("express");
const isAuth = require("../middleware/isAuth");
const { getOrders, postCreateOrder, postStartProduceOrder, postEndProduceOrder, postStartShipOrder, postEndShipOrder, getCreateOrder, getProduceOrder, getShipOrder, getOrdersQuantity, getSuccessOrder } = require("../controllers/order");

const router = express.Router();

router.get('/orders', isAuth, getOrders);
router.get('/orders/quantity', isAuth, getOrdersQuantity);
router.get('/orders/create', isAuth, getCreateOrder);
router.get('/orders/produce', isAuth, getProduceOrder);
router.get('/orders/ship', isAuth, getShipOrder);
router.get('/orders/success', isAuth, getSuccessOrder);
router.post('/order/create', isAuth, postCreateOrder);
router.post('/order/start-produce', isAuth, postStartProduceOrder);
router.post('/order/end-produce', isAuth, postEndProduceOrder);
router.post('/order/start-ship', isAuth, postStartShipOrder);
router.post('/order/end-ship', isAuth, postEndShipOrder);

module.exports = router;