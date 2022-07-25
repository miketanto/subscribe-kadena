import { createContext } from "react";

export const WalletContext = createContext({
    wallet: {
        privKey:"",
        guard:{},
        account:""
    },
    setWallet : ()=>{}
})