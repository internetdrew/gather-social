import {
  useRef,
  forwardRef,
  useImperativeHandle,
  type ForwardRefRenderFunction,
} from "react";
import { type EventInviteAssets } from "./UserEventsList";
import toast from "react-hot-toast";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface InviteModalProps {
  eventInvite: EventInviteAssets | null;
}

export interface InviteModalRef {
  openModal: () => void;
  closeModal: () => void;
}

const InviteModal: ForwardRefRenderFunction<
  InviteModalRef,
  InviteModalProps
> = ({ eventInvite }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (modalRef.current) modalRef.current.showModal();
  };

  const closeModal = () => {
    if (modalRef.current) modalRef.current.close();
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  const copyInviteUrl = async () => {
    if (eventInvite) {
      await navigator.clipboard.writeText(eventInvite.joinEventUrl);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <dialog
      ref={modalRef}
      className="top-1/2 -translate-y-1/2 rounded-lg p-4 ring-1 ring-famous-black"
    >
      <div className="flex w-full justify-end">
        <button
          className="rounded-md duration-300 hover:ring-1 hover:ring-slate-200"
          onClick={closeModal}
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
      </div>
      <div className="mx-auto flex flex-col items-center justify-center">
        <h3>Invite others to:</h3>
        <p className="text-lg font-semibold">{eventInvite?.eventTitle}</p>
        <p>Friends can scan this QR code:</p>
        {eventInvite && (
          <Image
            src={eventInvite.qrCodeImageUrl}
            alt="Event QR code image"
            width={250}
            height={250}
          />
        )}
        <p>Or you can send a link:</p>
        <button
          className="mt-2 w-full rounded-lg bg-pink-400 px-4 py-2 font-semibold ring-1 ring-famous-black duration-300 hover:bg-pink-500 active:scale-95"
          onClick={copyInviteUrl}
        >
          Copy Link
        </button>
      </div>
    </dialog>
  );
};

export default forwardRef(InviteModal);
