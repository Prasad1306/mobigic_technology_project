import config from "config";
import jwt from 'jsonwebtoken';

import cloudinary from 'cloudinary';
cloudinary.config({
  cloud_name: config.get('cloudinary.cloud_name'),
  api_key: config.get('cloudinary.api_key'),
  api_secret: config.get('cloudinary.api_secret')
});


module.exports = {

  getToken: async (payload) => {
    var token = await jwt.sign(payload, config.get('jwtsecret'), { expiresIn: "365d" })
    return token;
  },

  getImageUrl: async (files) => {
    var result = await cloudinary.v2.uploader.upload(files, { resource_type: "auto" })
    return result;
  },

  genBase64: async (data) => {
    return await qrcode.toDataURL(data);
  },

  getSecureUrl: async (base64) => {
    var result = await cloudinary.v2.uploader.upload(base64, { resource_type: "auto" });
    return result.secure_url;
  },

 

  generateCode(count) {
    var str = "" + (count + 1)
    var pad = "00000"
    var ans = pad.substring(0, pad.length - str.length) + str
    return "C" + ans;
  },


 

  uploadFile(file) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file, function (error, result) {
        console.log(result);
        if (error) {
          reject(error);
        }
        else {
          resolve(result.url)
        }
      });
    })
  },
  



  uploadImage(image) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, function (error, result) {
        console.log(result);
        if (error) {
          reject(error);
        }
        else {
          resolve(result.url)
        }
      });
    })
  },



  jwtcheck: (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.get("jwtsecret"), (err, result) => {
        if (err) {
          if (err.name == "TokenExpiredError") {
            return resolve(err)
          } else {
            return reject(err)
          }
        } else {
          return resolve(result)
        }
      })
    })


  },

}

