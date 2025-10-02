// routesConfig.ts
import { PATH_FILE } from "./data/typeData"

export const departmentRoutes = [
  { path: PATH_FILE.PRODUCTION, title: "Production" },
  { path: PATH_FILE.QUALITE, title: "Qualité" },
  { path: PATH_FILE.SANTE_SECURITE, title: "Santé et Sécurité" },
  { path: PATH_FILE.RH, title: "Ressources Humaines" },
  { path: PATH_FILE.MAINTENANCE, title: "Maintenance" },
  { path: PATH_FILE.DIRECTION, title: "Direction" },
  { path: PATH_FILE.SECURITE, title: "Sécurité" },
  { path: PATH_FILE.LOGISTIQUE, title: "Logistique" },
  { path: PATH_FILE.CERTIFICATION, title: "Certification" },
]

export const thematicRoutes = [
  { path: "/politique", title: "Politique" },
  { path: "/manuel", title: "Manuel" },
  { path: "/procedure", title: "Procédure" },
  { path: "/registre", title: "Registre" },
  { path: "/formulaire", title: "Formulaire" },
  { path: "/suivi", title: "Suivi" },
  { path: "/plan", title: "Plan" },
  { path: "/specification", title: "Spécification" },
  { path: "/demande", title: "Demande" },
  { path: "/compte-rendu", title: "Compte Rendu" },
  { path: "/proces-verbal", title: "Procès-Verbal" },
  { path: "/inventaire", title: "Inventaire" },
  { path: "/enquete", title: "Enquête" },
]
