import { create } from "zustand";

type Role = "admin" | "companyAdmin" | "companyUser"

interface RoleStore {
  role: Role;
  setRole: (role: Role) => void;
}

const useRoleStore = create<RoleStore>((set) => ({
  role: "admin",
  setRole: (role) => set({ role }),
}));

export default useRoleStore;