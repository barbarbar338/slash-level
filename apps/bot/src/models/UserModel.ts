import { Schema, model, Document } from "mongoose";
import { CONFIG } from "../config";

export interface IUserModel extends Document {
	userID: string;
	rankColor: string;
}

export const UserSchema = new Schema<IUserModel>({
	userID: {
		type: String,
		required: true,
	},
	rankColor: {
		type: String,
		required: true,
		default: CONFIG.DEFAULT_RANK_COLOR,
	},
});

export const UserModel = model<IUserModel>(
	"userModel",
	UserSchema,
	"USER_COLLECTION",
);
