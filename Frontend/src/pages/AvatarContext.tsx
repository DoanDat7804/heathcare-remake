// src/context/AvatarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AvatarContextType {
  avatar: string | null;
  setAvatar: (avatar: string | null) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const AvatarProvider = ({ children }: { children: ReactNode }) => {
  const [avatar, setAvatar] = useState<string | null>(null); // Mặc định không có ảnh

  return (
    <AvatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("useAvatar must be used within an AvatarProvider");
  }
  return context;
};  