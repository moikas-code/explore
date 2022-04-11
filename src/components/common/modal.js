import {useEffect} from 'react';
import Button from './button';
export default function Modal({children,onClose}) {
  useEffect(() => {}, []);
  return (
    <div className='modal z-2 bg-black d-block' tabIndex='-1' role='dialog'>
      <div
        className='position-absolute top-50 start-50 translate-middle w-100 modal-dialog'
        role='document'>
        <div className='modal-content'>
          <Button onClick={()=>onClose()}>
            Close
          </Button>
          <div className='modal-body'>{children}</div>
        </div>
      </div>
    </div>
  );
}
