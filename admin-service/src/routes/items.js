const itemsRouter = require('express').Router();
const validateToken = require('../middleware/validateToken');



const { createItem, getItemsByCategory, updateItem, deleteItem } = require('../controllers/items');

//create item to a paticular category
itemsRouter.post('/', validateToken, createItem);

//get all items in a category
itemsRouter.get('/:category_id', validateToken, getItemsByCategory);


//update item in a category
itemsRouter.put('/:item_id', validateToken, updateItem);

//delete item in a category
itemsRouter.delete('/:item_id', validateToken, deleteItem);

module.exports = itemsRouter;