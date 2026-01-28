import { VaultItem, ArchitectResponse } from '../types';

const VAULT_KEY = 'architect_go_vault_v1';

export const getVault = (): VaultItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load vault", e);
    return [];
  }
};

export const saveToVault = (data: ArchitectResponse, title?: string): VaultItem => {
  const currentVault = getVault();
  
  const newItem: VaultItem = {
    id: crypto.randomUUID(),
    title: title || `Architecture Scan ${new Date().toLocaleDateString()}`,
    createdAt: Date.now(),
    data
  };

  const updatedVault = [newItem, ...currentVault];
  localStorage.setItem(VAULT_KEY, JSON.stringify(updatedVault));
  return newItem;
};

export const deleteFromVault = (id: string): VaultItem[] => {
  const currentVault = getVault();
  const updatedVault = currentVault.filter(item => item.id !== id);
  localStorage.setItem(VAULT_KEY, JSON.stringify(updatedVault));
  return updatedVault;
};