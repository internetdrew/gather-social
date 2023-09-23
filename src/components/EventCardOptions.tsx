import { useState } from "react";
import Link from "next/link";
import { useDetectClickOutside } from "react-detect-click-outside";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import {
  PencilSquareIcon,
  // TrashIcon,ß
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { api } from "~/utils/api";

const OptionsMenu = (eventId: { eventId: string }) => {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useDetectClickOutside({ onTriggered: closeMenu });
  const id = eventId.eventId;

  const { mutate: downloadImagesFromEvent } =
    api.images.downloadImagesFromEvent.useMutation({
      onSuccess: (data) => {
        console.log(data);
      },
    });

  function closeMenu() {
    setShowMenu(false);
  }

  return (
    <div className="relative z-10 mt-1 h-6 w-6 flex-shrink-0" ref={ref}>
      <button onClick={() => setShowMenu(!showMenu)}>
        <EllipsisHorizontalIcon className="h-full w-full" />
      </button>

      <div
        className={`${
          showMenu ? "block" : "hidden"
        } absolute right-3 top-8 w-48 overflow-hidden rounded-md bg-slate-100 ring-1 ring-black transition-all ease-in-out`}
      >
        <ul>
          <li>
            <Link
              href={"/edit"}
              className="flex h-full w-full items-center border-b border-slate-300 p-2 duration-300 hover:bg-pink-500"
            >
              <span>
                <PencilSquareIcon className="mr-2 h-5 w-5" />
              </span>{" "}
              Edit event
            </Link>
          </li>
          <li>
            <button
              className="flex h-full w-full items-center p-2 duration-300 hover:bg-pink-500"
              onClick={() => downloadImagesFromEvent({ eventId: id })}
            >
              <span>
                <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
              </span>
              Download images
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OptionsMenu;
