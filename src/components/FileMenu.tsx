import React, { FC, useState } from "react";
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import { navItems, fileItems, adminItems, NavItem } from "./fileMenuItem";
import { useSelector } from "react-redux";
import { RootState } from "../redux";

const SidebarSection = ({ title, items }: { title?: string; items: NavItem[] }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <div className="flex gap-1 flex-col">
      {title && <h2 className="px-4 text-gray-400 text-xs uppercase">{title}</h2>}
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.title}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <span className="flex items-center gap-2">
                    <Icon icon={item.icon} className="text-lg" />
                    {item.title}
                  </span>
                  <Icon
                    icon={openSubmenu === item.title ? "mdi:chevron-up" : "mdi:chevron-down"}
                    className="text-gray-500"
                  />
                </button>
                {openSubmenu === item.title && (
                  <ul className="ml-6 space-y-1">
                    {item.submenu.map((sub) => (
                      <li key={sub.title}>
                        <NavLink
                          to={sub.link}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-1 rounded-md ${isActive ? "bg-primary text-white font-medium" : "text-gray-600 hover:bg-gray-100"
                            }`
                          }
                        >
                          {sub.icon && <Icon icon={sub.icon} className="text-sm" />}
                          {sub.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-md ${isActive ? "bg-primary text-white font-medium" : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon icon={item.icon} className="text-lg" />
                {item.title}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Sidebar: FC = () => {
  const userInfo = useSelector((state: RootState) => state.user.currentUser);
  const isAdmin = userInfo.roleUser === "admin";
  return (
    <aside className="h-full w-[250px] overflow-y-auto p-2">
      {/* <div className="p-4 font-bold text-xl text-gray-800">{title}</div> */}
      <nav className="flex flex-col gap-4">
        <SidebarSection items={navItems} />
        <SidebarSection title="Fichiers" items={fileItems} />
        {isAdmin && <SidebarSection title="Administration" items={adminItems} />}

      </nav>
    </aside>
  );
};

export default Sidebar;
