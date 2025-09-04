import React from 'react';
import TopFile from './TopFile';
import FileMenu from './FileMenu';
import Container from './Container';
import { Outlet } from 'react-router-dom';

const FileLayout = () => {
    return (
        <>
            <TopFile/>
          <div className="flex h-[80vh]">
            <FileMenu />
            <Container>
                <Outlet/>
            </Container>
          </div>
        </>
    );
};

export default FileLayout;