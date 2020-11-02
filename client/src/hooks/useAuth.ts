import { useEffect, useState } from "react";
import { useDELETE, usePOST } from "./api";

export const useAuth = () => {

  const creater = usePOST<{name: string}>("/users");
  const deleter = useDELETE("/private/me");
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(Boolean(localStorage.getItem('auth')));

  useEffect(() => {
    setIsLogin(Boolean(localStorage.getItem('auth')));
  }, [isLoading]);

  const login = async (username: string) => {
    if (isLoading) { return; }
    setIsLoading(true);
    await creater.send({name: username});
    localStorage.setItem("auth", "true");
    setIsLoading(false);
  };

  const logout = async () => {
    if (isLoading) { return; }
    setIsLoading(true);
    await deleter.send();
    // なんかremoveじゃないとうまくいかない
    localStorage.removeItem("auth");
    setIsLoading(false);
  };

  return {
    login,
    logout,
    isLoading,
    isLogin,
  };
};
