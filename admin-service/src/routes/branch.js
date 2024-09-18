const branchRouter = require('express').Router();
const validateToken = require('../middleware/validateToken');


const { createBranch, getBranch, updateBranch, deleteBranch } = require('../controllers/branch');



branchRouter.post('/', validateToken, createBranch);
branchRouter.get('/', validateToken, getBranch);
branchRouter.put('/', validateToken, updateBranch);
branchRouter.delete('/', validateToken, deleteBranch);

module.exports = branchRouter;