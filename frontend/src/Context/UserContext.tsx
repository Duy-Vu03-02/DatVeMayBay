import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Khởi tạo context với giá trị mặc định là undefined
export const UserContext = createContext<
  { userData: any; setUserData: Dispatch<SetStateAction<any>> } | undefined
>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<any>();

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
