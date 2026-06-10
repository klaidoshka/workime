import { Calendar, FolderOpen, House } from "@lucide/svelte";
import type { Component } from "svelte";

export const startupPages: StartupPageOption[] = [
  { value: "home", label: "Home", icon: House },
  { value: "projects", label: "Projects", icon: Calendar },
  { value: "calendar", label: "Calendar", icon: FolderOpen },
];

export interface StartupPageOption {
  value: StartupPage;
  label: string;
  icon: Component;
}

export type StartupPage = "home" | "projects" | "calendar";
