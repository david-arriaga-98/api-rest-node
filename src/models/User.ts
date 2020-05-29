import { model, Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
	name: string;
	lastname: string;
	schedule: string;
	email: string;
	password: string;
	state: boolean;
	createdAt: Date;
	updatedAt: Date;
	userToken: string;
	hashPassword(password: string): Promise<string>;
	comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema({
	name: String,
	lastname: String,
	schedule: String,
	email: String,
	password: String,
	state: { type: Boolean, default: false },
	createdAt: { type: Date, default: null },
	updatedAt: { type: Date, default: null },
	userToken: String
});

userSchema.methods.hashPassword = async (password: string): Promise<string> => {
	const salts = await bcrypt.genSalt(8);
	return bcrypt.hash(password, salts);
};

userSchema.methods.comparePassword = async function (
	password: string
): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

export default model<IUser>('User', userSchema);
