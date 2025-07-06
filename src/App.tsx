import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
  HomeLayout,
  Error,
  Landing,
  Login,
  Register,
  VerifyEmail,
  ResetPassword,
  About,
  Items,
  Contact,
  Profile,
  SingleItem,
} from './pages';
import {
  ErrorElement,
  ProfileItems,
  Resolved,
} from './components';
import { loader as verifyEmailLoader } from './pages/VerifyEmail';
import { loader as resetPasswordLoader } from './pages/ResetPassword';
import { loader as landingLoader } from './pages/Landing';
import { loader as singleItemLoader } from './pages/SingleItem';
import { loader as itemsLoader } from './pages/Items';
import { loader as profileLoader } from './pages/Profile';
import { loader as resolvedLoader } from './components/Resolved';
import { action as loginAction } from './pages/Login';
import { action as registerAction } from './pages/Register';
import { action as resetPasswordAction } from './pages/ResetPassword';
import { action as profileAction } from './components/ProfileCard';
import { store } from './store';
import React from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <ErrorElement />,
        loader: landingLoader,
      },
      {
        path: '/about',
        element: <About />,
        errorElement: <ErrorElement />,
      },
      {
        path: '/items',
        element: <Items />,
        errorElement: <ErrorElement />,
        loader: itemsLoader,
      },
      {
        path: '/contact',
        element: <Contact />,
        errorElement: <ErrorElement />,
      },
      {
        path: '/items/:id',
        element: <SingleItem />,
        loader: singleItemLoader,
        errorElement: <ErrorElement />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
    action: loginAction(store),
  },
  {
    path: 'register',
    element: <Register />,
    errorElement: <Error />,
    action: registerAction,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
    errorElement: <Error />,
    loader: resetPasswordLoader,
    action: resetPasswordAction,
  },
  {
    path: 'verify-email',
    element: <VerifyEmail />,
    errorElement: <Error />,
    loader: verifyEmailLoader,
  },
  {
    path: '/profile',
    element: <Profile />,
    errorElement: <Error />,
    loader: profileLoader,
    children: [
      {
        index: true,
        element: <Resolved />,
        errorElement: <ErrorElement />,
        loader: resolvedLoader,
      },
      {
        path: '/profile/items',
        element: <ProfileItems />,
        errorElement: <ErrorElement />,
        loader: profileLoader,
        action: profileAction,
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
