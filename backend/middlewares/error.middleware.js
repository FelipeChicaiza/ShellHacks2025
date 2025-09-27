

// Error handling middleware for Express, with Mongoose support
const errorMiddleware = (err, req, res, next) => {
	try {
        let error = {...err};
        error.message = err.message;
        console.error(err);

        // Handle Mongoose validation errors
	if (err.name === 'ValidationError') {
		return res.status(400).json({
			success: false,
			message: 'Validation Error',
			errors: err.errors,
		});
	}

	// Handle Mongoose bad ObjectId (CastError)
	if (err.name === 'CastError') {
		return res.status(400).json({
			success: false,
			message: `Invalid ${err.path}: ${err.value}`,
		});
	}

	res.status(err.status || 500).json({
		success: false,
		message: err.message || 'Internal Server Error',
	});
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;

