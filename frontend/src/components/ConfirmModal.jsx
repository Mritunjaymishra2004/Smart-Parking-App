import Modal from "./Modal";

export default function ConfirmModal({

  open,

  onClose,

  onConfirm,

  title = "Are you sure?",

}) {

  return (

    <Modal
      open={open}
      onClose={onClose}
    >

      <h2 className="
        text-2xl
        font-bold
        text-white
      ">

        {title}

      </h2>

      <div className="
        flex
        justify-end
        gap-3

        mt-6
      ">

        <button

          onClick={onClose}

          className="
            px-4
            py-2

            rounded-xl

            bg-slate-700

            text-white
          "
        >

          Cancel

        </button>

        <button

          onClick={onConfirm}

          className="
            px-4
            py-2

            rounded-xl

            bg-red-500

            text-white
          "
        >

          Confirm

        </button>

      </div>

    </Modal>
  );
}