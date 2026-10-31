import { ObjectId } from "mongodb";

export const toObjectId = (id: string) => (ObjectId.isValid(id) ? new ObjectId(id) : null);
