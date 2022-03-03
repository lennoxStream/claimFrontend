import { Contract } from '@ethersproject/contracts'
import { BigNumber } from 'ethers'

const evaluateTransaction = async (
    contract,
    methodName,
    args) => {
    return new Promise((resolve, reject){    
  try {
    const methods = await contract.callStatic
    const bcValues = await methods.[methodName](...args)
    return bcValues
  } catch (e) {
     console.log(e)
     return e
  }});
 }


const submitTransaction = async (
      methodsName,
      args,
      contract,
      account, 
      library) => {
      try {
      const callData =   contract.interface.encodeFunctionData(methodsName, args)
       return library.getSigner().sendTransaction({
          from: account ? account : undefined,
          to: contract.address,
          data: callData
       })
      } catch (e) {
        console.log(e)
        return e
      }
}

const useClaim = (index, address, amount, merkleProof) => {
const contract = getContract(
      CONTRACT_ADDRESS,
      abi,
      library);

const { account, library } = useActiveWeb3React()
return useCallback(
  async (address, amount) => {
      try {
      await submitTransaction('claim', [index, address, amount, merkleProof], contract, account, library)
      } catch (e) {
         console.log('error', e)
         return e
       }
},[submitTransaction, account, contract, library])
}