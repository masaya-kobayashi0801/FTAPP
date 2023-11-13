import { useState, useContext, createContext } from "react";

// コンテキストの作成
const ClientSecretContext = createContext();

// コンテキストのプロバイダー
export const ClientSecretProvider = ({children}) => {
    const [clientSecret, setClientSecret] = useState("");

    return (
      <ClientSecretContext.Provider value={{clientSecret, setClientSecret}}>
        {children}
      </ClientSecretContext.Provider>
    );
}

// カスタムフックを使用してコンテキストの値にアクセスする
export const useClientSecret = () => {
    const context = useContext(ClientSecretContext);
    if (!context) {
        throw new Error("useClientSecret must be used within a ClientSecretProvider");
    }
    return context;
}