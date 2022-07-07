import mongoose from "mongoose";
import { Account } from "../../../domain/account/account";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";
export class MongooseAccountRepository extends MongooseAsyncRepository<Account> {
  constructor() {
    const schema = new mongoose.Schema<Account>({
      id: String,
      email: String,
      hashedPassword: String,
      creationDate: Number,
    });
    super("account", schema);
  }
}
