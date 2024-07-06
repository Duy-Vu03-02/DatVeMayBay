import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import axios from "axios";

// Khởi tạo context với giá trị mặc định là undefined
export const UserContext = createContext<
  { userData: any; setUserData: Dispatch<SetStateAction<any>> } | undefined
>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const url = "http://192.168.41.26:8080/auth/user/loginByToken";
        const result = await axios.post(url, {}, { withCredentials: true });
        setUserData(result.data);
      } catch (err) {
        console.error(err);
        return;
      }
    };
    fetch();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
