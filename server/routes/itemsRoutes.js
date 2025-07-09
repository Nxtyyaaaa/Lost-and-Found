const express = require('express');
const router = express.Router();

const {authenticateUser} = require('../middleware/authentication');
const {getAllItems,getSingleItem,createItem,updateItem,deleteItem,uploadImages} = require('../controllers/ItemsController');

router.route('/').get(getAllItems).post(authenticateUser,createItem);
router.route('/upload-image').post(authenticateUser,uploadImages);
router.route('/:id').get(getSingleItem).patch(authenticateUser,updateItem).delete(authenticateUser,deleteItem);

module.exports = router;