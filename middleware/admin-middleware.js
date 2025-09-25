const isAdminUser = (req,res,next) => {
  if(req.userInfo.role !== 'admin') {
    return res.status(403).json({
      success : false,
      message : 'access denied admin rights req'
    })
  }
  next()
};



module.exports = isAdminUser;