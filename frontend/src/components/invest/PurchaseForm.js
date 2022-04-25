// import StatefulComponent from "../StatefulComponent";
import { useDispatch, useSelector } from "react-redux";
import PurchaseLimits from "./PurchaseLimits";
import { toast } from "react-toastify";
import Popup from './Popup/Popup';
import { useEffect, useState } from "react";

const PurchaseForm = () => {
    const [invest, setInvestAmount] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();
    const returnToken = useSelector(state => state.returnToken);
    const account = useSelector(state => state.account);
    const returnTokenAmount = useSelector(state => state.returnTokenAmount);
    const balanceOfPresaleToken = useSelector(state => state.balanceOfPresaleToken);
    const investTokenAmount = useSelector(state => state.investTokenAmount);

    const swap = () => {
        dispatch({ type: "SWAP_TOKEN", payload: { investTokenAmount: invest } });
    }

    const handleChange = (event) => {
        setInvestAmount(event.target.value);
        dispatch({
            type: 'GET_TOKEN_AMOUNT', payload: { investTokenAmount: event.target.value }
        });
    }

    const handleConnect = async () => {
        if (window.ethereum) {
            await window.ethereum.enable();
            dispatch({
                type: 'CONNECT_WALLET',
            });
        } else {
            toast.info('Please install metamask on your device', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        togglePopup();
    }

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const onClickMAX = () => {
        dispatch({ type: "GET_BALANCE_OF_PRESALED_TOKEN", payload: {} });
    }

    useEffect(() => {
        if (balanceOfPresaleToken >= 0) setInvestAmount(balanceOfPresaleToken);
    }, [balanceOfPresaleToken])

    useEffect(() => {
        if (investTokenAmount >= 0) setInvestAmount(investTokenAmount);
    }, [investTokenAmount])

    return (
        <>
            <div className="purchase-form wallet-connection" >
                <div className="purchase-amount">
                    {
                        account ?
                            <div className="account-address">{account.slice(0, 6) + "..." + account.slice(38)}</div>
                            :
                            <button onClick={() => togglePopup()} className="connectWallet">Connect wallet to swap</button>
                    }
                    <div className="newInputs">
                        <div className="leftInputs NewHolder">
                            <div className="amoutToken"><label>Enter amount</label></div>
                            <div className="newInputsItem">
                                {/* <input className={returnCoinAmount > 0 ? "input-warning active" : "input-warning"} type="text" placeholder="1000" */}
                                {
                                    account ?
                                        <input className="input-warning " type="text" placeholder="0"
                                            value={invest ?? ""}
                                            onChange={(e) => handleChange(e)} />
                                        :
                                        <input className="input-warning " type="text" placeholder="0"
                                            value={invest ?? ""}
                                            onChange={(e) => handleChange(e)} disabled />
                                }
                                <span className="max_button" onClick={() => onClickMAX()}>MAX</span>
                                <button className="selectDinar">
                                    <div className="optionDinar" >
                                        <div className="imageDinar"><img alt="USDC.e" src="/img/swapsicle-coin.png" /></div>
                                    </div>
                                    <div className="">pPOP</div>
                                </button>
                            </div>
                            <PurchaseLimits compact={true} />
                        </div>

                        <div className="rightInputs NewHolder">

                            <div className="amoutToken"><label>{returnToken} token</label></div>
                            <div className="newInputsItem">
                                <input className="disablePointer" type="text" placeholder="Autofill"
                                    value={returnTokenAmount ?? "Autofill"} onChange={() => { }} readOnly />
                                <button className="selectDinar">
                                    <div className="optionDinar" >
                                        <div className="imageDinar"><img src="/img/swapsicle-coin.png" alt="Swapsicle token" /></div>
                                    </div>
                                    <div className="">POP</div>
                                </button>
                            </div>
                        </div>

                    </div>
                    <button className="connectWallet" onClick={() => swap()}>Swap</button>
                </div>
                {isOpen && (
                    <Popup
                        content={
                            <>
                                <div className="connectTitle">Connect a wallet</div>
                                <div className="walletHolder">
                                    <div className="walletItem"><a onClick={() => handleConnect()} href="#root" ><img alt="MetaMask" src="/img/MetaMask_Fox.png" />MetaMask<span className="arrowRightBtn"><i className="fa-solid fa-chevron-right"></i></span></a></div>
                                </div>
                            </>
                        }
                        handleClose={() => togglePopup()}
                    />
                )}
            </div>
        </>
    );
}

export default PurchaseForm;