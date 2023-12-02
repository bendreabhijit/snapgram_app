import {ID, Query}  from 'appwrite'
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { INewUser } from "@/types";
import { account, appwriteconfig, avatars, databases } from "./config";


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