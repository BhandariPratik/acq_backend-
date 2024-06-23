let db = require('../models/connection');
const { Op } = require('sequelize');
let product = db.product;

const addProduct = async (req, res) => {
    try {
        let reqbody = req.body
        if (req.file) {
            reqbody.image = `http://localhost:4000/uploads/${req.file.filename}`;
        }
        console.log('reqbody===>>>>', reqbody)
        let data = await product.create(reqbody)

        console.log('data==>>>>>>>', data)
        res.status(200).json({ data, message: "Product added successfully" });
    }
    catch (err) {
        if (err instanceof db.Sequelize.UniqueConstraintError) {
            res.status(400).json({ message: "Please enter a unique value for product code" });
        } else {
            console.log('error', err)
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

const listProduct = async (req, res) => {
    try {
        const { search_text, category } = req.query;

        let query = {};
        if (search_text) {
            query.name = { [Op.like]: `%${search_text}%` }; 
        }
        if (category) {
            query.category = category;
        }
        let data = await product.findAll({
            where: query
        });
        res.status(200).json({ data, message: "Product retrieved Successfully" });
    }
    catch (err) {
        console.log('error', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


const deleteProduct = async (req, res) => {
    try {
        console.log('req.params.id',req)
        const productId = req.query.id;
        const result = await product.destroy({
            where: {
                id: productId
            }
        });

        if (result) {
            res.status(200).json({ message: "Product deleted successfully" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const findById = async (req, res) => {
    try {
        console.log('req.query.id',req.query.id)
        const productId = req.query.id;
        const user = await product.findOne({ where: { 'id': productId } });

        if (user) {
            res.status(200).json({ user, message: "Product Found" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateProduct = (async (req, res) => {
    try {
        let { id } = req?.body;

        let data = req.body; 
        if (req.file) {
            data.image = `http://localhost:4000/uploads/${req.file.filename}`;
        }

        let updateData = await product.update(data, {where: { 'id': parseInt(id) }});

        if (!updateData[0]) {
            res.status(404).json({  message: 'Product not found' });
        }
        res.status(200).json({ message: 'Data updated successfully' })
    }
    catch (err) {
        console.log('error',err)
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const getCategories = async (req, res) => {
    try {
        const distinctCategories = await product.findAll({
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('category')), 'category']
            ]
        });

        if (distinctCategories.length > 0) {
            const categories = distinctCategories.map(record => record.category);
            res.status(200).json({ categories, message: "Distinct Categories Found" });
        } else {
            res.status(404).json({ message: "No Categories Found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = {
    addProduct, listProduct, deleteProduct,findById,updateProduct,getCategories
}