import type { ReactNode } from "react";
import { UsersStoreProvider } from "../../entities/users/useStore";


interface ZustandProviderProps {
    children: ReactNode;
}

export const ZustandProvider = ({ children }: ZustandProviderProps) => {
    return <UsersStoreProvider>{children}</UsersStoreProvider>;
};
