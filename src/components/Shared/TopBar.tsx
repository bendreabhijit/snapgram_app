
import { Link,  useNavigate } from 'react-router-dom'

import { useSignOutAccount } from '@/lib/react-query/queryandmutation'
import {  useEffect } from 'react';
import { useUserContext } from '@/Context/AuthContext';
import { Button } from '../ui';

const Topbar = () => {

  const {mutate : SignOut ,isSuccess} = useSignOutAccount();
 
  const {user} =useUserContext();
  const imageurl =user.imageUrl 
  

  const Navigate =useNavigate();
  useEffect(()=>{
    if(isSuccess) Navigate(0);
    },[isSuccess]
  )
  return (
    
    <section className='topbar'>
      <div className='flex-between py-4 px-5'>
       <Link to="/" className="flex gap-3 items-center">
        <img 
       src='assets\images\logo.svg'
       alt='logo'
       width={130}
       height={325}
        />
       </Link>
       <div className='flex gap-5'>
        <Button variant={"ghost"} className='shad-button_ghost'onClick={()=>SignOut()}>
          <img src='assets\icons\logout.svg'></img>
        </Button>
        <Link to={`/Profile/${user.id}`} className='flex-center gap-3'>

              
              <img src={imageurl|| 'assets/icons/profile-placeholder.svg' } alt='Profile' className='h-8 w-8 rounded-full'></img>
        </Link>
       </div>

      </div>
      
      

    </section>
  )
}

export default Topbar