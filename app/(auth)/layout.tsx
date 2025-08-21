import React from 'react';
import { ReactNode } from 'react';

const AuthLayout = ({children}: {children:ReactNode}) => {
  return (
    <div className='auth-layout className="min-h-screen flex items-center justify-center bg-gray-50"'>{children}</div>
  );
}

export default AuthLayout;



