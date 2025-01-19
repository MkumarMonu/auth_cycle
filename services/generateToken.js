var jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ success: "false", message: "You are not a authorised user" });
  }

  try {
   // verify the token
    const decodedDataOfUser = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decodedDataOfUser;

    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ success: "false", message: "Invalid token p" });
  }
};


const generateToken = (userData,expireTime) => {

 const token = jwt.sign(userData, process.env.SECRET_KEY,{expiresIn:`${expireTime}`});

 return token;
}
module.exports = {verifyToken, generateToken};
