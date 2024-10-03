import { v4 as uuidv4 } from 'uuid';

export type Panel = {
  id: string;
  title: string;
};

export type PanelElement = {
  id: string;
  title: string;
  panelId: string;
};

export function createPanel(title?: string): Panel {
  const panels = JSON.parse(localStorage.getItem('panels')!) || [];
  const panel = {
    id: uuidv4(),
    title: title || 'Panel',
  };
  panels.push(panel);
  localStorage.setItem('panels', JSON.stringify(panels));
  return panel;
}

export function getPanels(): Panel[] | [] {
  return JSON.parse(localStorage.getItem('panels')!) || [];
}

export function updatePanel(id: string, title: string): Panel {
  const panels = JSON.parse(localStorage.getItem('panels')!) || [];
  const panel = panels.find((panel: Panel) => panel.id === id);
  if (panel) {
    panel.title = title;
    localStorage.setItem('panels', JSON.stringify(panels));
  }
  return panel;
}

export function deletePanel(id: string): boolean {
  const panels = JSON.parse(localStorage.getItem('panels')!) || [];
  const index = panels.findIndex((panel: Panel) => panel.id === id);
  if (index !== -1) {
    panels.splice(index, 1);
    localStorage.setItem('panels', JSON.stringify(panels));
    return true;
  }
  return false;
}

export function createElement(panelId: string, title?: string): PanelElement {
  const elements = JSON.parse(localStorage.getItem('elements')!) || [];

  const element = {
    id: uuidv4(),
    title: title || 'Element',
    panelId,
  };
  elements.push(element);
  localStorage.setItem('elements', JSON.stringify(elements));
  return element;
}

export function getElements(): PanelElement[] | [] {
  return JSON.parse(localStorage.getItem('elements')!) || [];
}

export function updateElement(id: string, panelId?: string, title?: string): PanelElement {
  const elements = JSON.parse(localStorage.getItem('elements')!) || [];
  const element = elements.find((element: PanelElement) => element.id === id);
  if (element) {
    if (panelId) {
      element.panelId = panelId;
    }
    if (title) {
      element.title = title;
    }
    localStorage.setItem('elements', JSON.stringify(elements));
  }
  return element;
}

export function deleteElement(id: string): boolean {
  const elements = JSON.parse(localStorage.getItem('elements')!) || [];
  const index = elements.findIndex((element: PanelElement) => element.id === id);
  if (index !== -1) {
    elements.splice(index, 1);
    localStorage.setItem('elements', JSON.stringify(elements));
    return true;
  }
  return false;
}