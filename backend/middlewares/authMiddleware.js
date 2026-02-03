import userModel from "../models/user.js";
import jwt from 'jsonwebtoken'

export const protect = async(req,res,next) =>{
    const token = req.cookies.token;
    if(!token)return res.status(401).json({message:"Unauthorized"});

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.user = await userModel.findById(decoded.userId).select("-password");
        next();
    }catch(error){
        return res.status(401).json({message:"Unauthorized"});
    }
}