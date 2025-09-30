import React, { useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from '../../convex/_generated/dataModel';
import { useWorkspace } from '../contexts/WorkspaceContext';

const SidebarLink = ({ href, children, isActive, onClick }: { href: string, children: React.ReactNode, isActive?: boolean, onClick?: () => void }) => (
  <a
    href={href}
    onClick={onClick}
    className={`flex-1 flex items-center gap-3 px-3 py-2 transition-colors cursor-pointer ${
      isActive
        ? 'text-gray-900 dark:text-gray-100 font-medium'
        : 'text-gray-600 dark:text-gray-400'
    }`}
  >
    {children}
  </a>
);

const SidebarIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center justify-center h-5 w-5">{children}</span>
);

export function Sidebar() {
  const workspaces = useQuery(api.workspaces.get);
  const addWorkspace = useMutation(api.workspaces.add);
  const removeWorkspace = useMutation(api.workspaces.remove);
  const updateWorkspace = useMutation(api.workspaces.update);

  const { selectedWorkspaceId, setSelectedWorkspaceId } = useWorkspace();

  useEffect(() => {
    // Select the first workspace by default if none is selected
    if (!selectedWorkspaceId && workspaces && workspaces.length > 0) {
      setSelectedWorkspaceId(workspaces[0]._id);
    }
  }, [workspaces, selectedWorkspaceId, setSelectedWorkspaceId]);


  const handleAddWorkspace = async () => {
    const name = prompt("Nhập tên không gian làm việc mới:");
    if (name) {
      try {
        const newWorkspaceId = await addWorkspace({ name });
        setSelectedWorkspaceId(newWorkspaceId);
      } catch (error) {
        console.error("Failed to add workspace", error);
        alert("Không thể tạo không gian làm việc. Vui lòng thử lại.");
      }
    }
  };

  const handleUpdateWorkspace = async (e: React.MouseEvent, id: Id<"workspaces">, currentName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newName = prompt("Nhập tên mới cho không gian làm việc:", currentName);
    if (newName && newName !== currentName) {
      try {
        await updateWorkspace({ id, name: newName });
      } catch (error) {
        console.error("Failed to update workspace", error);
        alert("Không thể cập nhật không gian làm việc. Vui lòng thử lại.");
      }
    }
  };

  const handleRemoveWorkspace = async (e: React.MouseEvent, id: Id<"workspaces">) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa không gian làm việc này không?")) {
      try {
        await removeWorkspace({ id });
        // If the deleted workspace was the selected one, select the first one or null
        if (selectedWorkspaceId === id) {
          setSelectedWorkspaceId(workspaces && workspaces.length > 1 ? workspaces.filter(w => w._id !== id)[0]._id : null);
        }
      } catch (error) {
        console.error("Failed to remove workspace", error);
        alert("Không thể xóa không gian làm việc. Vui lòng thử lại.");
      }
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 hidden md:block">
      <div className="flex flex-col h-full">
        <nav className="flex-1 space-y-6">
          <div>
            <div className="flex justify-between items-center px-3 mb-2">
              <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Không gian làm việc
              </h3>
              <button onClick={handleAddWorkspace} className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </button>
            </div>
            <ul className="space-y-1">
              {workspaces?.map((workspace) => (
                <li key={workspace._id} className={`group flex items-center justify-between rounded-lg ${selectedWorkspaceId === workspace._id ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                  <SidebarLink href="#" isActive={selectedWorkspaceId === workspace._id} onClick={() => setSelectedWorkspaceId(workspace._id)}>
                    <SidebarIcon>📝</SidebarIcon>
                    <span className="flex-1 truncate">{workspace.name}</span>
                  </SidebarLink>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => handleUpdateWorkspace(e, workspace._id, workspace.name)} className="p-1 mr-1 text-gray-500 hover:text-blue-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z"></path></svg>
                    </button>
                    <button onClick={(e) => handleRemoveWorkspace(e, workspace._id)} className="p-1 mr-2 text-gray-500 hover:text-red-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Cá nhân
            </h3>
            <ul className="space-y-1">
                <li className="group flex items-center justify-between rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    <SidebarLink href="#">
                        <SidebarIcon>⭐</SidebarIcon>
                        <span>Yêu thích</span>
                    </SidebarLink>
                </li>
                <li className="group flex items-center justify-between rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    <SidebarLink href="#">
                        <SidebarIcon>🗑️</SidebarIcon>
                        <span>Thùng rác</span>
                    </SidebarLink>
                </li>
            </ul>
          </div>
        </nav>
        <div className="mt-auto">
          {/* Placeholder for user profile or settings */}
        </div>
      </div>
    </aside>
  );
}
