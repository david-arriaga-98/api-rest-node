import mongoose from 'mongoose';

export default async (): Promise<void> => {
	try {
		await mongoose.connect(
			'mongodb+srv://david:david9812@cluster0-vciof.mongodb.net/angularData?retryWrites=true&w=majority',
			{
				useNewUrlParser: true,
				useFindAndModify: false,
				useUnifiedTopology: true
			}
		);
		console.log('>>> DB is connect');
	} catch (error) {
		console.log('>>> DB error', error);
	}
};
