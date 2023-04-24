import config from "config";
import jwt from "jsonwebtoken";
import userModel from "../models/user";

module.exports = {

  verifyToken(req, res, next) {
    if (req.headers.token) {
      jwt.verify(req.headers.token, config.get('jwtsecret'), (err, result) => {

        if (err) {
          if (err.name == "TokenExpiredError") {
            return res.status(440).send({ responseCode: 440, responseMessage: "Session Expired, Please login again." });
          } else {
            return res.status(401).send({ responseCode: 401, responseMessage: "Invalid Token" });
          }
        }
        else {
          userModel.findOne({ _id: result._id }, (error, result2) => {
            //console.log("17============",result2);
            if (error) {
              return next(error)
            } else if (!result2) {
              console.log(result2);
              return res.status(404).json({ responseCode: 404, responseMessage: "USER NOT FOUND" })
            } else {
              if (result2.status == "BLOCKED") {
                return res.status(403).json({ responseCode: 403, responseMessage: "You have been blocked by admin." })
              } else if (result2.status == "DELETE") {
                return res.status(402).json({ responseCode: 402, responseMessage: "Your account has been deleted by admin." })
              } else {
                req.userId = result._id;
                req.userDetails = result
                next();
              }
            }
          })
        }
      })
    } else {
      return res.status(401).send({ responseCode: 401, responseMessage: "Token is required" });
    }
  },

}


