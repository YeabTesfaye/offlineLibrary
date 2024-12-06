import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api";

export default class UnauthenticatedError extends CustomAPIError {
  statuscode: number;
  constructor(message: string) {
    super(message);
    this.statuscode = StatusCodes.UNAUTHORIZED;
  }
}
