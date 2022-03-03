import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'
import App from './App.js';

function getLibrary(provider) {
  return new Web3(provider)
}

function MyApp() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <App/>
    </Web3ReactProvider>
  )
}

export default MyApp
