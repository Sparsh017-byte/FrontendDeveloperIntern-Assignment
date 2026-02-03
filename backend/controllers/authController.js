import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import userModel from '../models/user.js'

export const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,


    })

}

export const registerUser = async(req,res) =>{
    try{
        const {userName,email,password} = req.body;
        if(!userName || !email || !password)return res.status(400).json({message:"All Fields Are Required"});
        const userExist = await userModel.findOne({email});
        if(userExist){
            return res.status(400).json({message:"User Already Exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await userModel.create({
            userName,
            email,
            password:hashedPassword
        });
        generateToken(res,user._id);
        res.status(201).json({
            userId:user._id,
            userName:user.userName,
            email:user.email
        })
    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password)return res.status(400).json({message:"All Fields Are Required"});
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid Email or Password"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Email or Password"});
        }
        generateToken(res,user._id);
        res.status(200).json({
            userId:user._id,
            userName:user.userName,
            email:user.email
        })
    }catch(error){
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const logout = (req,res) =>{
    res.cookie("token","",{
        httpOnly:true,
        expires:new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    })
    res.status(200).json({message:"Logout Successfully"})
}

export const getMe = (req,res)=>{
    res.status(200).json(req.user)
}

export const changeUserName = async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.userName = userName;
    await user.save();

    res.status(200).json({
      message: "Username updated successfully",
      userId: user._id,
      userName: user.userName,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
