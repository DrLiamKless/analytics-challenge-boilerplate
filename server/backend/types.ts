import { User as IUser } from "../../client/src/models/user";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
