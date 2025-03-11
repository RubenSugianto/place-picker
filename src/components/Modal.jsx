import { forwardRef, useRef, useEffect} from 'react';
import { createPortal } from 'react-dom';

const Modal = forwardRef(function Modal({ open, children, onClose }) {
  const dialog = useRef();

  /* 
  ini pake use effect karna ada dependencies yang param kedua [open]
  itu berfungsi dimana param 1 akan dijalankan ketika apa yang kita passing kesitu keubah
  dalam hal ini, open akan ada false / true, maka akan dijalankan ketika ada perubahan pada state
  */
  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
});

export default Modal;
