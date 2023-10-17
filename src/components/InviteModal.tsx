import {
  useRef,
  forwardRef,
  useImperativeHandle,
  type ForwardRefRenderFunction,
} from "react";
import { type Event } from "./EventCard";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

interface InviteModalProps {
  event: Event | null;
}

export interface InviteModalRef {
  openModal: () => void;
  closeModal: () => void;
}

const InviteModal: ForwardRefRenderFunction<
  InviteModalRef,
  InviteModalProps
> = ({ event }, ref) => {
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

  return (
    <dialog ref={modalRef} className="top-1/2 -translate-y-1/2">
      {event?.title}
    </dialog>
  );
};

export default forwardRef(InviteModal);
