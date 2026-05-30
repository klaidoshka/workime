import { House, FolderOpen, Calendar, Settings } from '@lucide/svelte';
import type { Component } from 'svelte';

export type Route = {
    path: string;
    icon: Component;
    label: string;
}

export const routes: Route[] = [
    { path: '/', icon: House, label: 'Home' },
    { path: '/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
];

export const settingsRoute: Route = { path: '/settings', icon: Settings, label: 'Settings' };