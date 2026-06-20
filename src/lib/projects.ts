// Thin selectors over PROJECTS. Server-safe (no client deps). Sorted by `order`
// so the rendered stack on the homepage matches the ordering in the data file.

import { PROJECTS, type Project } from "@/content/projects";

function byOrder(a: Project, b: Project) {
  return a.order - b.order;
}

export function getFlagshipProjects(): Project[] {
  return PROJECTS.filter((p) => p.kind === "flagship").sort(byOrder);
}

export function getPortfolioProjects(): Project[] {
  return PROJECTS.filter((p) => p.kind === "portfolio").sort(byOrder);
}

// All projects flagships-first, used by <ProjectStage> as the autoplay reel.
export function getAllStageItems(): Project[] {
  return [...getFlagshipProjects(), ...getPortfolioProjects()];
}

export type { Project };
