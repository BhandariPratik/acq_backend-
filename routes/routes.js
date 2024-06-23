const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController');
const productController = require('../controller/productController')

const multer = require('multer')

//multer 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

//auth
router.post('/login', loginController.login)
router.post('/register', loginController.addUser)

//product
router.post('/addProduct',[loginController.validateToken,upload.single('image'),productController.addProduct]);
router.get('/listProduct',[loginController.validateToken, productController.listProduct]);
router.put('/updateProduct',[loginController.validateToken,upload.single('image'), productController.updateProduct]);
router.get('/findById',[loginController.validateToken, productController.findById]);
router.get('/categories',[loginController.validateToken, productController.getCategories]);
router.delete('/delProduct',[loginController.validateToken, productController.deleteProduct]);

module.exports = router;