import { ReactNode, createContext, useEffect, useState } from "react";
import firebase, { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

export const AuthContext = createContext<firebase.User | null>(null);

type providerProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<providerProps> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser)
    );

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
