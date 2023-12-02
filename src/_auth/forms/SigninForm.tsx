
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"

import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import * as z from "zod"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SigninValidation } from '@/lib/Validation'
import Lodder from '@/components/Shared/Lodder'

import { useToast } from "@/components/ui/use-toast"

import {  useSignInAccount } from "@/lib/react-query/queryandmutation"
import { useUserContext } from "@/Context/AuthContext"

 



const SigninForm = () => {
  const { toast } = useToast()
  const {checkAuthUser,isLoading:isUserloding} = useUserContext();
  const navigate=useNavigate();

 
   // 1. Define your form.


 

  const {mutateAsync: SignInUserAcount  } =useSignInAccount();

   const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      
      email:'',
      password:'',

    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
   
    console.log(values)
    const session = await SignInUserAcount({
      email:values.email,
      password:values.password
    })


    
    if(!session){
      return toast({title: 'sign in failed . Please try again '})
    }

    



    const isLogedin  = await checkAuthUser();

    if(isLogedin){
      form.reset();
      navigate('/');
    }else{

     return  toast({
        title: "Sign in Failed, Please try again ",
        // description: "Friday, February 10, 2023 at 5:57 PM",
      })
    }
    // console.log(values);
    // console.log(newuser);
  } 
  
  return (
    <Form {...form}>
    <div className='sm:w-420 flex-centre flex-col'>
      <img src="/public/assets/images/logo.svg" alt='logo'></img>
      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12"> Login To Your Account </h2>
      <p className="text-light-3 small-medium mb:base-regular mt-2">Welcome Back ! Please enter your Detail</p>
    


    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
     
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" className="shad-input " {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" className="shad-input " {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="shad-button_primary">
       {isUserloding? (
        <div className="flex-centre flex gap-2">
         <Lodder/> Lodiing.....
        </div>
       ):"Sign Up"}
        </Button>
        <p className="text-small-regular text-light-2 text-center mt-2">
          Don't have an Account ?
         <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">
          Sign Up
         </Link>
        </p>
    </form>
    </div>
  </Form>
)
}
export default SigninForm