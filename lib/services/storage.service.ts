import { storage } from "@/appwrite/appwrite";
import { ID } from "appwrite";

export class Storage {
  public async createFile(
    bucketId: string,
    file: any,
    permissions: string[] = []
  ) {
    try {
      return await storage.createFile(bucketId, ID.unique(), file, permissions);
    } catch (error) {
      throw error;
    }
  }

  public async deleteFile(bucketId: string, fileId: string) {
    try {
      return await storage.deleteFile(bucketId, fileId);
    } catch (error) {
      throw error;
    }
  }

  public async getFileforView(bucketId: string, fileId: string) {
    try {
      return await storage.getFileView(bucketId, fileId);
    } catch (error) {
      throw error;
    }
  }
}

const StorageService = new Storage();
export default StorageService;
