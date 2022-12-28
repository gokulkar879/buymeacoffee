import React, { useContext, useEffect, useState } from 'react';
import {ethers} from 'ethers'
import abi from './utils/contract.json';
// import Web3 from 'web3';

const abiAddress = "0xfaa2E9ac03ED5E835BA0Eb25E6B6DE176a0F3b54";

const AppContext = React.createContext();

const AppProvider = ({children}) => {
   
    const [coffees, setCoffees] = useState([]);
    const [account, setAccount] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const isWalletConnected = async () => {
        const {ethereum} = window;
        console.log(ethereum);

        if(ethereum) {
            let wallet = null;
            try {
                wallet = await ethereum.request({
                    method: 'eth_requestAccounts'
                })
                if(wallet.length) {
                    setAccount(wallet[0]);
                } else {
                    console.log("please connect to metamask");
                }
            } catch(err) {
                console.log(err);
            }

        } else {
            console.log("please download metamask");
        }
    }
    
    const listAllCoffees = async () => {
        console.log("ppp0");
        const {ethereum} = window;
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();

        const deployed_contract = new ethers.Contract(
            abiAddress,
            abi["abi"],
            signer
        )

        const txn = await deployed_contract.listAllCoffees();
        console.log(txn)
        setCoffees(txn)
        // console.log(coffees)
    }
    
    const withdrawAllTips = async () => {
        const {ethereum} = window;
        if(ethereum && account) {
            const provider = new ethers.providers.Web3Provider(ethereum, "any");
            const signer = provider.getSigner();
    
            const deployed_contract = new ethers.Contract(
                abiAddress,
                abi["abi"],
                signer
            )
             try {
                const txn = await deployed_contract.withdrawTips();

                await txn.wait();
             } catch(err) {
                 console.log(err);
             }


        }
    }

    const buyCoffee = async () => {
        const {ethereum} = window;
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();

        const deployed_contract = new ethers.Contract(
            abiAddress,
            abi["abi"],
            signer
        )
        try {
            const txn = await deployed_contract.buyCoffee(
                name ? name : "Test",
                message ? message : "Test",
                {
                    value: ethers.utils.parseEther("0.001")
                }
            );
            await txn.wait();
        } catch(err) {
           console.log(err);
        }

       
        setMessage("");
        setName("");
    }

    useEffect(() => {
        let buyMeACoffee = null;
        const {ethereum} = window;
         isWalletConnected();
        if(ethereum) {
            listAllCoffees();
        }

         const onNewCoffee = (from, timestamp, name, message) => {
            console.log("p");
            console.log(coffees, from);
           setCoffees((prevState) => [...prevState, {
            from,
            timestamp: new Date(timestamp * 1000),
            name,
            message
           }])
         }



         if(ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum, "any");
            const signer = provider.getSigner();

            buyMeACoffee = new ethers.Contract(
                abiAddress,
                abi["abi"],
                signer
            )

            buyMeACoffee.on("newCoffee", onNewCoffee);
         } else {
            console.log("please install metamask");
         }

         return () => {
            if(buyMeACoffee) {
                buyMeACoffee.off("newCoffee", onNewCoffee);
            }
         }

    }, [])
    return <AppContext.Provider value={{
        buyCoffee,
        coffees,
        name, 
        setName,
        message,
        setMessage,
        withdrawAllTips

    }}>
        {
            children
        }
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}

export {AppProvider}