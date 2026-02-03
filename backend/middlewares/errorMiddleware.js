export const errorMiddleware = (err,req,res,next) =>{
    const statusCode = res.statusCode || 500;
    return res.status(statusCode).json({message:err.message});
}