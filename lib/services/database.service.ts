import { database } from "@/appwrite/appwrite";
import { ID } from "appwrite";

export class Database {
  public async createDocument(
    databaseId: string,
    collectionId: string,
    data: any,
    permissions: string[] = [],
    id = ID.unique()
  ) {
    try {
      return await database.createDocument(
        databaseId,
        collectionId,
        id,
        data,
        permissions
      );
    } catch (error) {
      throw error;
    }
  }

  public async listDocuments(
    databaseId: string,
    collectionId: string,
    queries: string[] = []
  ) {
    try {
      return queries?.length > 0
        ? await database.listDocuments(databaseId, collectionId, queries)
        : await database.listDocuments(databaseId, collectionId);
    } catch (error) {
      throw error;
    }
  }

  public async getDocument(
    databaseId: string,
    collectionId: string,
    documentId: string,
    queries: string[] = []
  ) {
    try {
      return queries?.length > 0
        ? await database.getDocument(
            databaseId,
            collectionId,
            documentId,
            queries
          )
        : await database.getDocument(databaseId, collectionId, documentId);
    } catch (error) {
      throw error;
    }
  }

  public async updateDocument(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: any,
    permissions: string[] = []
  ) {
    try {
      return permissions?.length > 0
        ? await database.updateDocument(
            databaseId,
            collectionId,
            documentId,
            data,
            permissions
          )
        : await database.updateDocument(
            databaseId,
            collectionId,
            documentId,
            data
          );
    } catch (error) {
      throw error;
    }
  }

  public async deleteDocument(
    databaseId: string,
    collectionId: string,
    documentId: string
  ) {
    try {
      return await database.deleteDocument(
        databaseId,
        collectionId,
        documentId
      );
    } catch (error) {
      throw error;
    }
  }
}

const DatabaseService = new Database();
export default DatabaseService;
