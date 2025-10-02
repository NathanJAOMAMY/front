import SideBar from './SideBar';
import { Outlet, useLocation } from 'react-router-dom';

const GlobalLayout = () => {
  const location = useLocation();
    return (
        <div className="flex max-h-[100vh] h-[100vh]">
        <div className="left-side">
          <SideBar />
        </div>
        <div className="right-side flex-1">
          <Outlet/>
        </div>
      </div>
    );
};

export default GlobalLayout;