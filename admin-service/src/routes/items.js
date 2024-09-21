const itemsRouter = require('express').Router();
const validateToken = require('../middleware/validateToken');



const { createItem, getItem, updateItem, deleteItem } = require('../controllers/items');

//create item to a paticular category
itemsRouter.post('/:categoryID', validateToken, createItem);

//get all items in a category
itemsRouter.get('/:categoryID', validateToken, getItem);


//update item in a category
itemsRouter.put('/:categoryID/:itemID', validateToken, updateItem);

//delete item in a category
itemsRouter.delete('/:categoryID/:itemID', validateToken, deleteItem);


module.exports = itemsRouter;