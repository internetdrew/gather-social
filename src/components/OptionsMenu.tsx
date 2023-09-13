import { useState } from "react";
import Link from "next/link";
import { useDetectClickOutside } from "react-detect-click-outside";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

interface MenuOption {
  id: number;
  intent: string;
  caption: string;
  url?: string;
  icon: JSX.Element;
}

interface OptionsMenuProps {
  options: MenuOption[];
  eventId: string;
}

const OptionsMenu = (props: OptionsMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useDetectClickOutside({ onTriggered: closeMenu });

  function closeMenu() {
    setShowMenu(false);
  }

  const { options } = props;

  return (
    <div className="relative z-10 mt-1 h-6 w-6 flex-shrink-0" ref={ref}>
      <button onClick={() => setShowMenu(!showMenu)}>
        <EllipsisHorizontalIcon className="h-full w-full" />
      </button>

      <div
        className={`${
          showMenu ? "block" : "hidden"
        } absolute right-3 top-8 w-40 overflow-hidden rounded-md bg-slate-100 ring-1 ring-black transition-all ease-in-out`}
      >
        <ul>
          {options.map((option, idx, arr) => (
            <li
              key={option.id}
              className={`${
                arr.length === 1 || idx === arr.length - 1
                  ? ""
                  : "border-b border-gray-300"
              } duration-300 hover:bg-pink-500`}
            >
              {option.url && option.intent === "edit" ? (
                <Link
                  href={option.url}
                  className="flex h-full w-full items-center p-2"
                >
                  {option.icon} {option.caption}
                </Link>
              ) : (
                <button className="flex h-full w-full items-center p-2">
                  {option.icon} {option.caption}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OptionsMenu;
