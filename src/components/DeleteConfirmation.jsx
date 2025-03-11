import { useEffect } from 'react';

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  /*
  Pada kondisi ini, dependencies akan berupa function (onConfirm)
  Function dalam js menghasilkan Object
  Dalam JS, Object yang dihasilkan function dengan waktu render berbeda (rerender) TIDAK SAMA
  Setiap app component di render ulang, function onConfirm (handleRemovePlace) akan di render ulang
  Ketika di pass ke DeleteConfirmation, dia akan menjalankan function onConfirm dimana didalamnya
  terdapat state yang berubah sehingga mengakibatkan app component di render ulang
  Ini akan menyebabkan INFINITE LOOP
  Namun, karena state setModalIsOpen(false) pada handleRemovePlace membuat delete confirmation ditutup
  dapat dilihat di modal, dimana ada kondisi {open ? children : null}
  maka AMAN.
  Namun tetap perlu penjangaan ketika menggunakan functions sebagai dependencies di use effect
  yaitu dengan useCallback
  */
  useEffect(() => {
    console.log('TIMER SET');
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);

    return () => {
      console.log('TIMER CLEARED');
      clearTimeout(timer);
    }
  }, []);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
    </div>
  );
}
