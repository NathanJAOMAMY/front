import React from 'react';

const Loader = () => {
    return (
        <>
            <div class="w-16 h-16 border-4 border-transparent text-primary text-4xl animate-spin flex items-center justify-center border-t-primary rounded-full">
            <div class="w-13 h-13 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-primary/50 rounded-full"></div>
          </div>
        </>
    );
};

export default Loader;