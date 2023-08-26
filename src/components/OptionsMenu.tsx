import { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

interface MenuOption {
  id: number;
  intent: string;
  url: string;
  icon: JSX.Element;
}

interface OptionsMenuProps {
  options: MenuOption[];
  eventId: string;
}

const OptionsMenu = (props: OptionsMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const { options } = props;
  return (
    <div className="relative mt-1 h-6 w-6 flex-shrink-0">
      <button onClick={() => setShowMenu(!showMenu)}>
        <EllipsisVerticalIcon className="h-full w-full" />
      </button>

      <div
        className={`${
          showMenu ? "opacity-100" : "hidden opacity-0"
        } absolute right-3 top-8 w-40 overflow-hidden rounded-md ring-1 ring-black transition-opacity ease-in-out`}
      >
        <ul className="text-sm">
          {options.map((option, idx, arr) => (
            <li
              key={option.id}
              className={`${
                arr.length === 1 || idx === arr.length - 1
                  ? ""
                  : "border-b border-gray-300"
              } duration-300 hover:bg-pink-500`}
            >
              <button className="flex h-full w-full items-center p-2">
                {option.icon} {option.intent}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OptionsMenu;
