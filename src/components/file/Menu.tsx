import { Icon } from '@iconify/react/dist/iconify.js';
import { FC } from 'react';
interface MenuProps {
  index: number;
  handleClick: () => void;
  isOpen: number | null;
  handleRemove: () => void;
  handleDownload: () => void;
  on?: string;
  fileName ? : string
}
const Menu: FC<MenuProps> = ({ index, handleClick, isOpen, handleRemove, handleDownload, on , fileName}) => {

  return (
    <div className='relative inline-block'>
      <Icon icon="ri:more-line" className={`cursor-pointer ${on === 'grid' && 'rotate-90'}`} onClick={handleClick} />
      <ul className={`bg-secondt rounded-sm text-white  z-100 ${isOpen !== index && 'hidden'} absolute top-full z-20 shadow-lg`}>
        <li className='hover:bg-gray-500 rounded-sm cursor-pointer px-2 py-1' onClick={handleDownload}>Telecharger</li>
        <li className='hover:bg-gray-500 rounded-sm cursor-pointer px-2 py-1' onClick={handleRemove}>Supprimer</li>
      </ul>
    </div>
  );
};

export default Menu;