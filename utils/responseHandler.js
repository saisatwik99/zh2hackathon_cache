const partial = (error, data) => ((error && data) && 206) || 0;

const errored = (error) => (error && error.HttpError) || (error instanceof Error && 500);

const success = (data, code) => (data && (code || 200)) || code || 201;

const statusCode = (error, data, code) => partial(error, data) || errored(error) || success(data, code);

export default (res) => (error, data, code) => res.status(statusCode(error, data, code)).json({ error, data });
