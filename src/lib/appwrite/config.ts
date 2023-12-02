import {Client,Account,Databases,Storage,Avatars} from 'appwrite'



export const appwriteconfig ={
    ProjectId : import.meta.env.VITE_APPWRITE_PROJECT_ID ,
    Url : import.meta.env.VITE_APPWRITE_PROJECT_URL,
    DatabasesId : import.meta.env.VITE_APPWRITE_DATABASE_ID,
    StorageId : import.meta.env.VITE_APPWRITE_STORAGE_ID,
    UserCollectionID : import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    PostCollectionID : import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
    SavesCollectionID : import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,

}

export const client = new Client();

client.setProject(appwriteconfig.ProjectId);
client.setEndpoint(appwriteconfig.Url)
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
