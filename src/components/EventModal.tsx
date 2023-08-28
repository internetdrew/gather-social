import { useRef } from "react";

const EventModal = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { current: dialog } = modalRef;

  // const openModal = () => {
  //   if (!dialog) return;
  //   dialog.showModal();
  // };

  const closeModal = () => {
    if (!dialog) return;
    dialog.close();
  };

  return (
    <dialog
      open
      className="h-56 w-[95%] rounded-3xl bg-slate-100 p-6 text-center font-semibold ring-1 ring-black  sm:w-1/2 lg:w-1/3"
      ref={modalRef}
    >
      <p className="mt-4 px-4 text-xl font-normal">
        Activate the event space for{" "}
        <span className="font-semibold">{"event?.title"}</span>?
      </p>
      <p className="mt-1">{"You'll have 30 days to use the space."}</p>
      <div className="mx-auto mt-16 flex w-[90%] items-center justify-between gap-4">
        <button className="w-full rounded-full bg-pink-500 px-4 py-2 ring-1 ring-black duration-300 hover:scale-105 hover:shadow-2xl active:scale-95">
          Yes
        </button>
        <button
          className="w-full rounded-full px-4 py-2 ring-1 ring-black duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
          onClick={closeModal}
        >
          No
        </button>
      </div>
    </dialog>
  );
};

export default EventModal;
