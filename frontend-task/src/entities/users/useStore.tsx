import { create } from 'zustand'
import type { User } from './type'
import { createContext, useContext } from 'react'

interface UserStore {
  users: User[]
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  updateUser: (id: string, updatedFields: Partial<User>) => void
  deleteUserFromStore: (id: string) => void
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
  updateUser: (id, updatedFields) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updatedFields } : user
      ),
    })),
  deleteUserFromStore: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}))


const UsersStoreContext = createContext<ReturnType<typeof useUserStore> | null>(null);

export const UsersStoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UsersStoreContext.Provider value={useUserStore}>
      {children}
    </UsersStoreContext.Provider>
  );
};

export const useUsers = () => {
  const store = useContext(UsersStoreContext);
  if (!store) {
    throw new Error('useUsers must be used within a UsersStoreProvider');
  }
  return store;
};