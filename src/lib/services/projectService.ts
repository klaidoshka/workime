import { invokeBridge } from "$lib/bridge";
import { DEFAULT_COLOR, DEFAULT_ICON } from "$lib/constants/projects";
import ParseUtils from "$lib/utils/parse";
import type { Project, RecentProject } from "../representation/project";

export type ProjectUpdates = Partial<{
  label: string;
  icon: string;
  color: string;
  pinned: boolean;
  completed: boolean;
  scratchPad: string;
  expectedCompletionHours: number;
}>;

export async function fetchProjects(): Promise<Project[]> {
  const response = await invokeBridge<Project[]>("query_projects");

  return response.value?.map(p => ParseUtils.parseProject(p)) || [];
}

export async function fetchRecentProjects(limit: number): Promise<RecentProject[]> {
  const response = await invokeBridge<any[]>("query_recent_projects", { limit });

  return response.value?.map(p => ParseUtils.parseRecentProject(p)) || [];
}

export async function createProject(label: string): Promise<Project> {
  const response = await invokeBridge<Project>("create_project", {
    label,
    icon: DEFAULT_ICON,
    color: DEFAULT_COLOR,
  });

  return ParseUtils.parseProject(response.value);
}

export async function updateProject(
  id: number,
  updates: ProjectUpdates
): Promise<Project> {
  const response = await invokeBridge<Project>("edit_project", {
    id,
    ...updates
  });

  return ParseUtils.parseProject(response.value);
}

export async function removeProject(id: number): Promise<void> {
  await invokeBridge<void>("delete_project", { id });
}
