import { FC, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode
}
const Container: FC<ContainerProps> = ({ children }) => {
  return (
    <div className='bg-white rounded-tl-lg h-full rounded-bl-lg px-4 py-2 flex flex-col flex-1 relative text-gray-800'>
      {children}
    </div>
  );
};

export default Container;