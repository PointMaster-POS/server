const branchRouter = require('express').Router();
const validateToken = require('../middleware/validateToken');


const { createBranch, getBranch, updateBranch, deleteBranch ,getAllBranches} = require('../controllers/branch');



branchRouter.post('/', validateToken, createBranch);
branchRouter.get('/:branch_id', validateToken, getBranch);
branchRouter.get('/', validateToken, getAllBranches);
branchRouter.put('/:branch_id', validateToken, updateBranch);
branchRouter.delete('/:branch_id', validateToken, deleteBranch);

module.exports = branchRouter;