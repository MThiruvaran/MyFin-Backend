const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) => {
    const token = req.header('Authorization')?.split(' ')[1]

    if(!token) return res.json({message:'No token, authorization denied'})
    
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({message:'Token is not valid'})
    }
}

module.exports = verifyToken