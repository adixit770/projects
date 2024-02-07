const express=require('express');
const { userSignUp, userLoginController, generateDataId, getAnalyticsData } = require('../Controller/userController');
const { verifyToken } = require('../Middleware/auth');
const router=express.Router();


router.post('/signupUser',userSignUp);
router.post('/logInUser',userLoginController);
router.get('/generate-data-id',generateDataId) 
router.get('/analytics',verifyToken, getAnalyticsData)




module.exports={router}