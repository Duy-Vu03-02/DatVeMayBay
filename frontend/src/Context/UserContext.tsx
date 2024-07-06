import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

// Khởi tạo context với giá trị mặc định là undefined
export const UserContext = createContext<
  { userData: any; setUserData: Dispatch<SetStateAction<any>> } | undefined
>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
