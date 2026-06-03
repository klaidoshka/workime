import type { Project } from '$lib/representation/project';
import {
  Activity,
  BarChart2, Bookmark, BookOpen, Box, Briefcase, Bug,
  Calendar,
  Camera,
  Clapperboard,
  Clock,
  Cloud, Code2,
  Coffee,
  Coins,
  Compass, Cpu, Crown, Database, Diamond, FileText, Flame,
  FlaskConical,
  Folder,
  Gift,
  GraduationCap,
  Heart, Home, Layers, Layout, Leaf, Lightbulb, Lock, Map,
  Megaphone, MessageSquare,
  Moon, Music, Package, Palette,
  PenTool,
  Plane,
  Puzzle, Rocket, Server, Settings, Shield,
  ShoppingBag,
  Star, Sun, Tag, Target, Terminal,
  TrendingUp,
  Users,
  Video,
  Wrench, Zap
} from '@lucide/svelte';

export const ICON_MAP = {
  Folder, Star, Bookmark, Tag, FileText, Layers, Box, Package, ShoppingBag,
  Briefcase, Target, Rocket, BarChart2, TrendingUp, Coins, Crown, Diamond,
  Code2, Terminal, Bug, Cpu, Database, Server, Cloud, Shield, Lock, Settings,
  Layout, Palette, PenTool, Camera, Video, Clapperboard, Music, Lightbulb, Puzzle,
  Users, MessageSquare, Megaphone, Heart, Activity,
  Clock, Calendar, Home, Wrench, Coffee, Gift, Map, Compass, Plane,
  Leaf, Sun, Moon, Flame, Zap, GraduationCap, BookOpen, FlaskConical
} as const;

export type ProjectIconName = keyof typeof ICON_MAP;
export const PROJECT_ICON_NAMES = Object.keys(ICON_MAP) as ProjectIconName[];

export const PROJECT_COLORS = [
  { id: 'red', value: '#ef4444' },
  { id: 'coral', value: '#d97b5f' },
  { id: 'orange', value: '#f97316' },
  { id: 'amber', value: '#f59e0b' },
  { id: 'lime', value: '#84cc16' },
  { id: 'green', value: '#22c55e' },
  { id: 'teal', value: '#14b8a6' },
  { id: 'sky', value: '#0ea5e9' },
  { id: 'blue', value: '#3b82f6' },
  { id: 'indigo', value: '#6366f1' },
  { id: 'violet', value: '#8b5cf6' },
  { id: 'fuchsia', value: '#d946ef' },
  { id: 'pink', value: '#ec4899' },
  { id: 'rose', value: '#f43f5e' },
  { id: 'slate', value: '#64748b' },
] as const;

export type ProjectColorId = typeof PROJECT_COLORS[number]['id'] | string;

export const DEFAULT_ICON: ProjectIconName = 'Folder';
export const DEFAULT_COLOR = 'coral';

export function getColorValue(colorId?: string): string {
  if (!colorId) {
    return '#3b82f6';
  }

  if (colorId.startsWith('#')) {
    return colorId;
  }

  return PROJECT_COLORS.find(c => c.id === colorId)?.value ?? '#3b82f6';
}

export function getIconComponent(iconName?: string) {
  return ICON_MAP[(iconName as ProjectIconName) ?? DEFAULT_ICON] ?? Folder;
}

export function randomColor(): string {
  return PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)].id;
}

export function getProjectIconAndColor(project: Project) {
  const iconKey = (project.icon ?? DEFAULT_ICON) as ProjectIconName;
  const IconComp = ICON_MAP[iconKey] ?? ICON_MAP[DEFAULT_ICON];
  const colorValue = getColorValue(project.color ?? DEFAULT_COLOR);

  return { iconKey, IconComp, colorValue };
}
