
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/toaster.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { CategoriesProvider } from './context/CategoriesContext.tsx'
import { RecoilRoot } from 'recoil'

createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
  <UserProvider>
    <CategoriesProvider>
  <BrowserRouter>
 
    <App />

  <Toaster/>
  </BrowserRouter>
  </CategoriesProvider>
  </UserProvider>
  </RecoilRoot>
)
