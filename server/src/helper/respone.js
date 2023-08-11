export const errorRespone = (
  res,
  { statusCode = 500, message = "Internal Server Error" }
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
export const successRespone = (
  res,
  { statusCode = 200, message = "Success", payload = {} }
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    payload,
  });
};
