const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
      return res.status(401).json({
        success : false,
        message : 'access denied no token detected login to continue'
      })
    }
    //decode this token
    try{
      const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY)
      console.log(decodedToken);
      // we are passing this so admin will also get this 
      req.userInfo = decodedToken
      next()
    } catch(error){
        return res.status(401).json({
        success : false,
        message : 'access denied no token detected login to continue'
      })
    }

}

module.exports = authMiddleware;