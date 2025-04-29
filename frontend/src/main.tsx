import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Feed from './features/feed/pages/Feed/Feed'
import { Login } from './features/authentication/pages/Login/Login'
import { Signup } from './features/authentication/pages/Signup/Signup'
import { ResetPassword } from './features/authentication/pages/ResetPassword/ResetPassword'
import { VerifyEmail } from './features/authentication/pages/VerifyEmail/VerifyEmail'
import { AuthenticationContextProvider } from './features/authentication/context/AuthenticationContextProvider'
import { AuthenticationLayout } from './features/authentication/components/AuthenticationLayout/AuthenticationLayout'
import ApplicationLayout from './components/ApplicationLayout/ApplicationLayout'
import { Profile } from './features/authentication/pages/Profile/Profile'

const router = createBrowserRouter([
  {
    element: <AuthenticationContextProvider />,
    children: [
      {
        path: "/",
        element: <ApplicationLayout />,
        children: [
          { index: true, element: <Feed /> },
          { path: "network", element: <div>Network</div> },
          { path: "jobs", element: <div>Jobs</div> },
          { path: "messaging", element: <div>Messaging</div> },
          { path: "notifications", element: <div>Notifications</div> },
          { path: "profile/:id", element: <div>Profile</div> },
          { path: "settings", element: <div>Settings & Privacy</div> },
        ],
      },
      {
        path: "/authentication",
        element: <AuthenticationLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
          { path: "reset-password", element: <ResetPassword /> },
          { path: "verify-email", element: <VerifyEmail /> },
          { path: "profile/:id", element: <Profile /> }
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" />
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
