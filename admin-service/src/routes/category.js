const categoryRouter = require('express').Router();


const {updateCategory, deleteCategory, createCategory} = require('../controllers/categories');

categoryRouter.post('/', createCategory);
categoryRouter.put('/:categoryID', updateCategory);
categoryRouter.delete('/:categoryID', deleteCategory);

module.exports = categoryRouter;