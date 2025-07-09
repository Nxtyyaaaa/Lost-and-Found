const express = require('express');
const router = express.Router();

const {getAllUsers,getCurrentUser,getSingleUser,updateUser,deleteUser} = require("../controllers/userController");
const {authenticateUser,authorizePermissions} = require('../middleware/authentication');

router.route('/').get(authenticateUser,authorizePermissions('admin'),getAllUsers);
router.route('/update/:id').patch(authenticateUser,updateUser);
router.route('/delete/:id').delete(authenticateUser,deleteUser);
router.route('/current').get(authenticateUser,getCurrentUser);
router.route('/:id').get(authenticateUser,getSingleUser);

module.exports = router;