import { Id } from '../../convex/_generated/dataModel';
import { create } from 'zustand';

interface WorkspaceState {
  selectedWorkspaceId: Id<"workspaces"> | null;
  setSelectedWorkspaceId: (id: Id<"workspaces"> | null) => void;
}

export const useWorkspace = create<WorkspaceState>((set) => ({
  selectedWorkspaceId: null,
  setSelectedWorkspaceId: (id) => set({ selectedWorkspaceId: id }),
}));
