import { Main } from "./pages/Main.tsx";
import { CreateWallet } from "./pages/CreateWallet.tsx";
import { ImportWallet } from "./pages/ImportWallet.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { ComponentType, JSX } from "react";
import { PasswordForm } from "./pages/PasswordForm.tsx";

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: "/", Component: Main },
  { path: "/create", Component: CreateWallet },
  { path: "/import", Component: ImportWallet },
  { path: "/dashboard", Component: Dashboard },
  { path: "/password", Component: PasswordForm },
];
