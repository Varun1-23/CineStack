import jwt  from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";


export const verifyUser = (req, res, next) => {
  const token = req.cookies?.userToken;

  if (!token) {
    throw new ApiError(401, 'Unauthorized: No user token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains userId
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid user token');
  }
};