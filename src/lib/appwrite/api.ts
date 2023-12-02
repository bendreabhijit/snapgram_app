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
        return newAccount;

        if(!newAccount) throw Error;
        const AvtarUrl = avatars.getInitials(user.name)
        
        const newuser = await saveUserToDB({
            accountId:newAccount.$id,
            name:newAccount.name,
            email:newAccount.email,
            username:user.username,
            imageurl:AvtarUrl.toString(),
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
    accountId :string;
    email:string;
    name:string;
    imageurl:string;
    username?:string;
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
                [Query.equal('accountId',CurrentAccount.$id)]
            )
            if(!currentUser) throw Error;

            return currentUser.documents[0];
    }
    catch(error)
    {
        console.log(error);
    }
    
}