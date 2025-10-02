import TopFile from './TopFile';
import FileMenu from './FileMenu';
import Container from './Container';
import { Outlet } from 'react-router-dom';

const FileLayout = () => {
  return (
    <div className='flex flex-col '>
      <TopFile />
      <div className="flex h-[85vh]">
        <FileMenu />
        <Container>
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default FileLayout;