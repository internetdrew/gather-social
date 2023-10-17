import { useState } from "react";
import Link from "next/link";
import { useDetectClickOutside } from "react-detect-click-outside";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import {
  PencilSquareIcon,
  ArrowDownTrayIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { api } from "~/utils/api";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { InviteModalRef } from "./InviteModal";

const hyphenateStr = (str: string) => {
  if (str)
    return str
      .split(" ")
      .map((word) => {
        return word.toLowerCase();
      })
      .join("-");
};

interface OptionsMenuProps {
  eventId: string;
  inviteModalRef: React.RefObject<InviteModalRef | null>;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  inviteModalRef,
  eventId,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useDetectClickOutside({ onTriggered: closeMenu });
  const id = eventId;

  const { data: eventDetails } = api.events.getEventDetails.useQuery({
    eventId: eventId,
  });

  const eventTitle = eventDetails?.title;
  const eventIsActive = Boolean(eventDetails?.startDate);

  const zipName = hyphenateStr(eventTitle!);

  const {
    mutate: downloadImagesFromEvent,
    isLoading: zippingImages,
    // isSuccess: zippingImages,
  } = api.images.fetchUrlsForEventImages.useMutation({
    onSuccess: async (imageData) => {
      const zip = new JSZip();

      for (const dataSet of imageData!) {
        if (dataSet) {
          const keySplit = dataSet.key?.split("/");
          const fileName = keySplit?.[keySplit.length - 1];

          const res = await fetch(dataSet.signedUrl);
          const data = await res.blob();

          zip.file(fileName!, data);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `gather-social-images-${zipName}`);
      setShowMenu(false);
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
        } absolute right-0 top-8 w-44 overflow-hidden rounded-md bg-famous-white font-medium ring-1 ring-black transition-all ease-in-out`}
      >
        <ul>
          <li>
            <Link
              href={"/edit"}
              className={`flex h-full w-full items-center ${
                eventDetails?.startDate ? "border-b border-famous-black" : ""
              } border-opacity-30 p-2 duration-300 hover:bg-pink-400`}
            >
              <span>
                <PencilSquareIcon className="mr-2 h-5 w-5" />
              </span>{" "}
              Edit event name
            </Link>
          </li>
          {eventIsActive ? (
            <>
              <li>
                <button
                  className="flex h-full w-full items-center border-b border-famous-black border-opacity-30 p-2 duration-300 hover:bg-pink-400"
                  onClick={() => {
                    if (inviteModalRef.current) {
                      inviteModalRef.current.openModal();
                    }
                  }}
                >
                  <span>
                    <UserPlusIcon className="mr-2 h-5 w-5" />
                  </span>{" "}
                  Invite guests
                </button>
              </li>
              <li>
                <button
                  className="flex h-full w-full items-center p-2 duration-300 hover:bg-pink-400"
                  onClick={() => downloadImagesFromEvent({ eventId: id })}
                  disabled={zippingImages}
                >
                  <span>
                    <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                  </span>
                  {zippingImages ? "Downloading..." : "Download images"}
                </button>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

export default OptionsMenu;
