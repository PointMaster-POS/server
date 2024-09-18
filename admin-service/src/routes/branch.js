const branchRouter = require('express').Router();
const validateToken = require('../middleware/validateToken');


const { createBranch, getBranch, updateBranch, deleteBranch ,getAllBranches} = require('../controllers/branch');



branchRouter.post('/', validateToken, createBranch);
branchRouter.get('/:branch_id', validateToken, getBranch);
branchRouter.get('/', validateToken, getAllBranches);
branchRouter.put('/', validateToken, updateBranch);
branchRouter.delete('/', validateToken, deleteBranch);

module.exports = branchRouter;