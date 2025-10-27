import * as signalR from "@microsoft/signalr";
import { useState, useEffect, createContext } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const [user, setUser] = useState(null); // Login ചെയ്ത user info
  
  useEffect(() => {
    if (!user) return;

    // 👇 Dynamic role and id
    const role = user.role?.toLowerCase(); // 'Admin' or 'Customer'
    const userId = user.id;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7044/chathub?role=${role}&userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => console.log(`✅ SignalR Connected (${role})`))
      .catch(err => console.error("❌ SignalR Error:", err));

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, [user]); // re-run when user changes (login/logout)

  return (
    <GlobalContext.Provider value={{ connection, user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};
