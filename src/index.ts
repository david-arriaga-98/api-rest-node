import app from './App';

const main = async (): Promise<void> => {
	try {
		await app.listen(app.get('port'));
		console.log('Server on port:', app.get('port'));
	} catch (error) {
		console.log('Server error:', error);
	}
};

main();
