import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import userType from "../enums/userType";
import status from '../enums/status';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate';

var fileModel = new Schema(
    {
        filecode: { type: String, unique: true },
        file: { type: String },
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

fileModel.plugin(mongoosePaginate);
fileModel.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("file", fileModel);