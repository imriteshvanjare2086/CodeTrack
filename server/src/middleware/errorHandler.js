export function errorHandler(err, _req, res, _next) {
  const status = typeof err?.status === "number" ? err.status : 500;
  const message =
    typeof err?.message === "string" && err.message.length > 0
      ? err.message
      : "Internal Server Error";

  if (status >= 500) {
     
    console.error(err);
  }

  res.status(status).json({ error: { message, status } });
}

