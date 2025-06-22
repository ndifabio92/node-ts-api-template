import mongoose from "mongoose";

interface ConnectionOptions {
  mongoUrl: string;
  dbName: string;
}

export class MongoConnection {
  static async connect(options: ConnectionOptions) {
    try {
      await mongoose.connect(options.mongoUrl, {
        dbName: options.dbName,
      });
      console.log("Mongo Connected");
    } catch (error) {
      console.log("Mongo connection error");
      throw error;
    }
  }
}
