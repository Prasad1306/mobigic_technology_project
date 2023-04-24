import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate';
var userModel = new Schema(
  {
    userName: { type: String },
    password: { type: String },
    userType: {
      type: String,
      enum: [userType.ADMIN, userType.USER],
      default: userType.USER
    },
    status: {
      type: String,
      default: status.ACTIVE
    },
  },
  { timestamps: true }
);

userModel.plugin(mongoosePaginate);
userModel.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("user", userModel);