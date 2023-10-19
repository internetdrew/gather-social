import {
  useRef,
  forwardRef,
  useImperativeHandle,
  type ForwardRefRenderFunction,
} from "react";
import { type EventInviteAssets } from "./UserEventsList";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Image from "next/image";

interface InviteModalProps {
  assets: EventInviteAssets | null;
}

export interface InviteModalRef {
  openModal: () => void;
  closeModal: () => void;
}

const InviteModal: ForwardRefRenderFunction<
  InviteModalRef,
  InviteModalProps
> = ({ assets }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  console.log(assets);

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

  return (
    <dialog ref={modalRef} className="top-1/2 -translate-y-1/2">
      {assets && (
        <>
          <Image
            src={assets.qrCodeImageUrl}
            alt="Event QR code image"
            width={200}
            height={200}
          />
          <p>{assets?.joinEventUrl}</p>
        </>
      )}
    </dialog>
  );
};

export default forwardRef(InviteModal);
