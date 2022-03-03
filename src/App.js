import {claimContract as contract} from './contract.js'
import {HXYContract as B0} from './contract.js'
import './App.css';
import hxymoney from './hxymoney.png';
import metafox from './metafox.png';
import hxy from './hxy.png';
import hex from './hex.png';
import hbscmoney from './hbscmoney.png';
import horizontal_bar from './horizontal_bar.png';
import  {Web3ReactProvider} from '@web3-react/core';
import { useWeb3React } from "@web3-react/core";
import MyApp from './_app'
import {useState, useEffect} from 'react'
import {injectedProvider} from './ip.js'
const data = require('./data.json')

  function App() {

const {
    account,
    activate,
    active,
    chainId,
    library,
    deactivate,
    error,
    setError,

} = useWeb3React();

var addresses;

const handleConnect = async () => {
    await activate(injectedProvider);
    if (window.ethereum) {
          console.log("BalanceCheck")
          addresses = await window.ethereum.request({method: "eth_requestAccounts",});
              if(addresses.length>0){await BalanceCheck();}
        }
  }

const [TokenBalance, setTokenBalance] = useState('');

var HXYbalance;

const BalanceCheck = async () => {
  try{
    HXYbalance = await B0.methods.balanceOf(addresses[0]).call();
    setTokenBalance(HXYbalance/1000000000000000000);
  }
   catch(e) {
                HXYbalance = await B0.methods.balanceOf(addresses[0]).call();
    setTokenBalance(HXYbalance/1000000000000000000);}



}

/*const evaluateTransaction = async (
    contract,
    methodName,
    args) => {
    return new Promise((resolve, reject)=>{    
  try {
    const methods = contract.callStatic
    const bcValues = methods?.[methodName](...args)
    return bcValues
  } catch (e) {
     console.log(e)
     return e
  }});
 }
 */

var argumentts;

const submitTransaction = async (
      methodsName,
      contract,
      account, 
      library) => {
    const transactionParameters = {
    to: "0xC9c2399E8B69DEF81c5A2905079DE67cFAd3844F", // Required except during contract publications.
    from: account, // must match user's active address.
    data: contract.methods.claim(data[account]["index"], account, data[account]["amount"], data[account]["proof"]).encodeABI(),
  };
      try {

    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    if (window.confirm('Click "ok" to view tx receipt on etherscan or "cancel" to stay')) 
        {window.open("https://rinkeby.etherscan.io/"+txHash, "_blank");};
      } catch (e) {
        alert("Error Occured :(")
        console.log(e)
        return e
      }

}

const hasClaimed = async () => {
 if(data[account]){
 try {
 let claimCheck = await contract.methods.isClaimed(data[account]["index"]).call();
      if(!claimCheck) await Claim(); else alert("This Address Has Already Claimed");

      } catch (e) {
        console.log(e)
        return e
      }
    }

 else {alert("Connect Metamask or Address not Found")}

}

const Claim = async () => {
      
      try {
      await submitTransaction('claim', contract, account, library)
      setTokenBalance(TokenBalance + parseInt(data[account]['amount'],16)/1000000000000000000);
      } catch (e) {
         alert("Your Address is Not In This Campaign");
         console.log('error', e);
         return e
       }
     
}



  return (
    <div className="App">
        <div className="navbar"><img className="hxymoney" src={hxymoney}></img>
        </div>
        <div>
          <button className="connect_wallet" onClick={(e)=>handleConnect()}>{active?"Wallet Active":"CONNECT WALLET"}</button>
        </div>
        <div className="headtext"><img className="img1" src={hbscmoney}></img><span className="black">HBSC</span><span className="orange"> Bonus</span><span className="orange"> for</span><span className="black"> hxy.business </span><span className="orange">investors (1 of 4)</span></div>
        <div className="headtext2">Claim your hxy business investors' HBSC bonus.</div>
        <div className="headbar">
          <div className="welcome">Welcome !</div>
          <img className="metafox" src={metafox}></img>
          <div className="address">{active?(account.substr(0,7)+"....."+account.substr(-8)):"No wallet connected"}</div>
          <div className="hxylabel">HXY</div>
          <div className="hxyamount">{account ? TokenBalance : 0}</div>
          <div className="hxypng"><img className="hxylogo" src={hxy}></img></div>
          <div className="text1">Your Wallet Balance </div>          



        </div>
        <div className="main-container">
           <div className="summary">There is a HBSC bonus for hxy business investors which is summarised in the HBSC white paper.<br/><br/>
           The amount you are eligible to claim is shown below (please
           connect your wallet).<br/><br/>The claim period will be open for 
           3 months to allow hxy.business investors to claim their HBSC tokens. Any unclaimed tokens<br/> will be reinvested back into the project.</div>
           <table className="claim"><tbody><tr><td className="ca">Claimable Amount</td><td className="cc">Claim Compensation</td></tr></tbody></table>
           <img className="horizontal_bar" src={horizontal_bar}></img> 
           <table className="claimRow2"><tbody><tr><td className="ca2"><span className="claim_amount">{data[account] ? parseInt(data[account]['amount'],16)/1000000000000000000 : "00.00"}</span><span className="label_2"> HBSC</span></td><td><button className="cc2" onClick={(e)=>hasClaimed()}>CLAIM</button></td></tr></tbody></table>

        </div>
    </div>
  );
}

export default App;
