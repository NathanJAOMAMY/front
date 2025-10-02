export interface NavItem {
  title: string;
  icon: string;
  link: string;
  submenu?: NavItem[];
}

export const navItems: NavItem[] = [
  { title: "Accueil", icon: "flowbite:home-solid", link: "/" },
  { title: "Images", icon: "ion:images", link: "/image" },
  { title: "Partagés", icon: "ic:round-folder-shared", link: "/share" },
  { title: "Partagés avec moi", icon: "fa:users", link: "/share-with-me" },
];

export const fileItems: NavItem[] = [
  {
    title: "Département",
    icon: "bi:building",
    link: "",
    submenu: [
      { title: "Production", icon: "mdi:factory", link: "/production" },
      { title: "Qualité", icon: "mdi:check-decagram", link: "/quality" },
      { title: "Santé-Sécurité", icon: "mdi:shield-account", link: "/health-security" },
      { title: "Ressources Humaines", icon: "mdi:account-group", link: "/rh" },
      { title: "Maintenance", icon: "mdi:tools", link: "/maintenance" },
      { title: "Direction", icon: "mdi:briefcase", link: "/direction" },
      { title: "Sécurité", icon: "mdi:shield-lock", link: "/security" },
      { title: "Logistique", icon: "mdi:truck", link: "/logistique" },
      { title: "Certification", icon: "mdi:certificate", link: "/certification" },
    ],
  },
  {
    title: "Thématique",
    icon: "mdi:format-list-bulleted-type",
    link: "",
    submenu: [
      { title: "Politique", icon: "mdi:script-text", link: "/politique" },
      { title: "Manuel", icon: "mdi:book-open-page-variant", link: "/manuel" },
      { title: "Procédure", icon: "mdi:file-document", link: "/procedure" },
      { title: "Registre", icon: "mdi:clipboard-text", link: "/registre" },
      { title: "Formulaire", icon: "mdi:form-textbox", link: "/formulaire" },
      { title: "Suivi", icon: "mdi:timeline-check", link: "/suivi" },
      { title: "Plan", icon: "mdi:calendar-multiselect", link: "/plan" },
      { title: "Spécification", icon: "mdi:file-search", link: "/specification" },
      { title: "Demande", icon: "mdi:file-send", link: "/demande" },
      { title: "Compte Rendu", icon: "mdi:file-document-edit", link: "/compte-rendu" },
      { title: "Procès-Verbal", icon: "mdi:scale-balance", link: "/proces-verbal" },
      { title: "Inventaire", icon: "mdi:warehouse", link: "/inventaire" },
      { title: "Enquête", icon: "mdi:magnify-scan", link: "/enquete" },
    ],
  },
];

export const adminItems: NavItem[] = [
  { title: "Code d'inscription", icon: "formkit:password", link: "/sign-code" },
  { title: "Utilisateurs", icon: "vaadin:users", link: "/users" },
];
