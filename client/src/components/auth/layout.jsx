import { Outlet } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';
import eleganceLogo from '../../../public/eleganceLogo.svg';

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-0">
        <img src={logo} className="h-full w-full object-cover object-center" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-[20px]">
          <img src={eleganceLogo} className="w-32 h-32 lg:hidden" />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
