import React from 'react';

const Container = (props) => {
    return (
        <div className='ml-3 bg-white rounded-lg px-4 py-2 flex-1 relative text-black overflow-auto'>
        {props.children}
        </div>
    );
};

export default Container;