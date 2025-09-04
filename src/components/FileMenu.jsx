import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

const FileMenu = () => {
  // const { userInfo } = useAuth();
  
  const localStoreUser = localStorage.getItem('userInfo') || null
  const userInfo = JSON.parse(localStoreUser)
  
  const isAdmin = userInfo.roleUser === "admin";

  const [subOpen, setSubOpen] = useState("");

  const toggleSubMenu = (value) => {
    setSubOpen(subOpen === value ? "" : value);
  };

  const navItems = [
    {
      title: "Accueil",
      icon: "flowbite:home-solid",
      link: "/",
    },
    {
      title: "Images",
      icon: "ion:images",
      link: "/image",
    },
    {
      title: "Partagés",
      icon: "ic:round-folder-shared",
      link: "/share",
    },
    {
      title: "Partagés avec moi",
      icon: "fa:users",
      link: "/share-with-me",
    },
  ];

  const fileItems = [
    {
      title: "Département",
      icon: "bi:building",
      submenu: [
        { title: "Production" },
        { title: "Qualité" },
        { title: "Santé-Sécurité" },
        { title: "Ressources Humaines" },
        { title: "Maintenance" },
        { title: "Direction" },
        { title: "Sécurité" },
        { title: "Logistique" },
        { title: "Certification" },
      ],
    },
    {
      title: "Thématique",
      icon: "mdi:format-list-bulleted-type",
      submenu: [
        { title: "Politique" },
        { title: "Manuel" },
        { title: "Procédure" },
        { title: "Registre" },
        { title: "Formulaire" },
        { title: "Suivi" },
        { title: "Plan" },
        { title: "Spécification" },
        { title: "Demande" },
        { title: "Compte Rendu" },
        { title: "Procès-Verbal" },
        { title: "Inventaire" },
        { title: "Enquête" },
      ],
    },
  ];

  const adminItems = [
    {
      title: "Code d'inscription",
      icon: "formkit:password",
      link: "/sign-code",
    },
    {
      title: "Utilisateurs",
      icon: "vaadin:users",
      link: "/users",
    },
  ];

  const renderMenuItem = (item) => {
    if (item.link) {
      return (
        <NavLink key={item.title} to={item.link} className="flex items-center">
          {({ isActive }) => (
            <li
              className={`mx-2 my-2 flex gap-1 items-center ${
                isActive ? "text-black" : "text-secondt"
              }`}
            >
              <Icon icon={item.icon} className="size-6" />
              {item.title}
            </li>
          )}
        </NavLink>
      );
    }

    return (
      <li
        key={item.title}
        onClick={() => toggleSubMenu(item.title)}
        className="mx-2 my-2 text-secondt cursor-pointer"
      >
        <span className="flex gap-1 items-center">
          <Icon icon={item.icon} className="size-6" />
          {item.title}
        </span>
        <ul
          className={`pl-6 overflow-hidden transition-all duration-300 ${
            subOpen === item.title ? "max-h-96" : "max-h-0"
          }`}
        >
          {item.submenu.map((sub, idx) => (
            <li key={`${item.title}-${idx}`} className="mt-1 text-sm">
              {sub.title}
            </li>
          ))}
        </ul>
      </li>
    );
  };

  return (
    <div className="px-5 h-[80vh] overflow-x-auto overflow-y-auto">
      <ul>
        {navItems.map(renderMenuItem)}
      </ul>

      <div className="text-black text-middle mt-4">
        <p className="font-semibold mb-2">Fichiers</p>
        <ul className="text-base">
          {fileItems.map(renderMenuItem)}
        </ul>
      </div>

      {isAdmin && (
        <div className="text-black text-middle mt-4">
          <p className="font-semibold mb-2">Admin</p>
          <ul className="text-base">
            {adminItems.map(renderMenuItem)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileMenu;
