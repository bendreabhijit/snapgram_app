import {
   
    useMutation, useQueryClient,
    
 } from '@tanstack/react-query'
import { CreateUserAccount, SignInAccount, SignOutAccount, createPost, updatePost } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost } from '@/types'
import { QUERY_KEYS } from './queryKeys'



 export const useCreateUserAccount =() =>{


   
    return useMutation({
        mutationFn: ( user :INewUser) =>CreateUserAccount(user)
    })
 }


 export const useSignInAccount =() =>{
    return useMutation({
        mutationFn: ( user :{
             email :string ;
             password : string;
            }) =>SignInAccount(user)
    })
 }

 export const useSignOutAccount =() =>{
   return useMutation({
       mutationFn: SignOutAccount
   })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
  };


  export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: IUpdatePost) => updatePost(post),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
        });
      },
    });
  };