import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Khởi tạo context với giá trị mặc định
export const TicketContext = createContext<
  { ticket: string; setTicket: Dispatch<SetStateAction<string>> } | undefined
>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [ticket, setTicket] = useState<string>("");

  return (
    <TicketContext.Provider value={{ ticket, setTicket }}>
      {children}
    </TicketContext.Provider>
  );
};
