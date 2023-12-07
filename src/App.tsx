
import './global.css'
import {Routes,Route} from 'react-router-dom'
import SigninForm from './_auth/forms/SigninForm'
import { Home } from './_root/pages'
import SignupForm from './_auth/forms/SignupForm'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import { Toaster } from './components/ui/toaster'
import CreatePost from './_root/pages/CreatePost'


const App = () => {


  return (
    <main className='flex h-screen'>

        <Routes>
            {}
            <Route element={<AuthLayout/>}>
                <Route path="/sign-in"  element={<SigninForm/>}></Route>
                <Route path="/sign-up"  element={<SignupForm/>}></Route>
            </Route>
           
            {}

            <Route element={<RootLayout/>}>
                <Route index element={<Home/>}/> 
                <Route path="/createpost" element={<CreatePost />} />
            </Route>
            
        </Routes>
        <Toaster />
    </main>
  )
}

export default App