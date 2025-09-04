import { Icon } from '@iconify/react/dist/iconify.js';
// import axios from 'axios';
// import fileDownload from 'js-file-download';

const Menu = ({index, handleClick, isOpen, handleRemove, handleDownload, on}) => {
    
    return (
        <div className='relative inline-block'>
                <Icon icon="ri:more-line" className={`cursor-pointer ${on ==='grid'&&'rotate-90'}`} onClick={handleClick}/>
            <ul className={`bg-secondt rounded-sm text-white  z-100 ${isOpen !== index && 'hidden'} absolute top-full z-20 shadow-lg`}>
                <li className='hover:bg-gray-500 rounded-sm cursor-pointer px-2 py-1' onClick={handleDownload}>Telecharger</li>
                <li className='hover:bg-gray-500 rounded-sm cursor-pointer px-2 py-1' onClick={handleRemove}>Supprimer</li>
            </ul>
            
        </div>
    );
};

export default Menu;