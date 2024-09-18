const itemsRouter = require('express').Router();
const validateToken = require('../middleware/validateToken');



const { createItem, getItem, updateItem, deleteItem } = require('../controllers/items');

//branch id and the category id and the  is in the body of the request if owner is creating item
itemsRouter.post('/', validateToken, createItem);

//branch id is in the token if manager is creating item 
//branch id is in the body of the request if owner is creating item
itemsRouter.get('/owner/:category_id', validateToken, getItem);
itemsRouter.get('/manager/:category_id', validateToken, getItem);

//only the owner can update the item and delete the item
itemsRouter.put('/:category_id', validateToken, updateItem);
itemsRouter.delete('/category_id', validateToken, deleteItem);

module.exports = itemsRouter;