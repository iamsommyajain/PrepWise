import React from 'react';
import { ReactNode } from 'react';
 
const Layout = ({children}: {children:ReactNode}) => {
  return (
    <div className='pattern'>{children}</div>
  );
}

export default Layout;
