import {ID, Query}  from 'appwrite'
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteconfig, avatars, databases, storage } from "./config";


export  async function CreateUserAccount(user:INewUser) 
{
    
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
            
        )
            
        if(!newAccount) throw Error;
        const AvtarUrl = avatars.getInitials(user.name)
        
        
        const newuser = await saveUserToDB({
            AccountId:newAccount.$id,
            Name:newAccount.name,
            Email:newAccount.email,
            UserName:user.username,
            ImageUrl:AvtarUrl.toString(),
        })

        
        return newuser;
        
    }
    catch(error)
    {
        
        console.log(error);
        
        return error;
    }
}

export async function saveUserToDB( user :{
    AccountId :string;
    Email:string;
    Name:string;
    ImageUrl:string;
    UserName?:string;
}){

    try{
            const newuser  = await databases.createDocument(
                appwriteconfig.DatabasesId,
                appwriteconfig.UserCollectionID,
                ID.unique(),
                user,
            )
            
            return newuser;

    }catch(error){
        console.log(error);
    }

}

export async function SignInAccount(user:{email:string; password:string}) {

    try{

        const session = await account.createEmailSession(user.email,user.password);
        return session;
    }catch(error){
        console.log(error)
    }
    
}

export async function getCurrentUser() {

    try{
       

     
            const  CurrentAccount =  await account.get();

            if(!CurrentAccount) throw Error;

            console.log(CurrentAccount)

            const currentUser = await databases.listDocuments(
                appwriteconfig.DatabasesId,
                appwriteconfig.UserCollectionID,
                [Query.equal('AccountId',CurrentAccount.$id)]
            )
            if(!currentUser) throw Error;
            
            
            return currentUser.documents[0];
    }
    catch(error)
    {
        console.log(error);
    }
    
}

export async function SignOutAccount(){
    try{

        const session = await account.deleteSession("current");

        return session;
    }catch(error){
        console.log(error)
    }
}



export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
  
      if (!uploadedFile) throw Error;
  
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      // Create post
      const newPost = await databases.createDocument(
        appwriteconfig.DatabasesId,
        appwriteconfig.PostCollectionID,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
  
      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      return newPost;
    } catch (error) {
      console.log(error);
    }
  }



  // ============================== UPLOAD FILE
export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appwriteconfig.StorageId,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET FILE URL
  export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteconfig.StorageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== DELETE FILE
  export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteconfig.StorageId, fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }

  // ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteconfig.DatabasesId,
      appwriteconfig.PostCollectionID,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
