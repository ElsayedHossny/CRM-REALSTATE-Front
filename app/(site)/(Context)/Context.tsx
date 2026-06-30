"use client";

import React, { createContext, useState, useEffect } from "react";

type UserContextType = {
  UserToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

interface Props {
  children: React.ReactNode;
}

export default function UserContextProvider({ children }: Props) {
  // 1. ابدأ دائماً بـ null لضمان التطابق بين السيرفر والمتصفح
  const [UserToken, setUserToken] = useState<string | null>(null);

  // 2. استخدم useEffect لقراءة localStorage فقط بعد تحميل الصفحة في المتصفح
  useEffect(() => {
    const token = localStorage.getItem("userToken2");
    if (token) {
      setUserToken(token);
    }
  }, []);

  return (
    <UserContext.Provider value={{ UserToken, setUserToken }}>
      {children}
    </UserContext.Provider>
  );
}
