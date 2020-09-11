/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Web3ProviderModal from 'components/Web3ProviderModal';
import Footer from 'components/Footer';
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { Web3Provider } from '@ethersproject/providers';
import { getChainData } from '../../utils/utilities';

import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

// Initial State
const INITIAL_STATE = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  pendingRequest: false,
  result: null
};


class App extends React.Component {

  constructor (props) {

    super(props);

    this.state = {
      ...INITIAL_STATE,
    };

    // Inititalize web3 modal
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      // providerOptions: this.getProviderOptions()
    })
  }

  // Init Web3
  initWeb3(provider) {
    const web3 = new Web3(provider);
  
    web3.eth.extend({
      methods: [
        {
          name: "chainId",
          call: "eth_chainId",
          // outputFormatter: web3.utils.hexToNumber
        }
      ]
    });
  
    return web3;
  }

  // Get the current eth network
  getNetwork = () => getChainData(this.state.chainId).network;

  // On Connect Wallet 
  onConnect = async () => {
    const provider = await this.web3Modal.connect();

    await this.subscribeProvider(provider);

    const web3 = this.initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    await this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId
    });
    // await this.getAccountAssets();
  };

  // Subscribe provider to events
  subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts) => {
      await this.setState({ address: accounts[0] });
      // await this.getAccountAssets();
    });
    provider.on("chainChanged", async (chainId) => {
      const { web3 } = this.state;
      const networkId = await web3.eth.net.getId();
      await this.setState({ chainId, networkId });
      // await this.getAccountAssets();
    });

    provider.on("networkChanged", async (networkId) => {
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      await this.setState({ chainId, networkId });
      // await this.getAccountAssets();
    });
  };

  // Toggle Connect Wallet modal
  toggleModal = () =>
    this.setState({ showModal: !this.state.showModal });

  render () {
    return (
      <AppWrapper>
        <Helmet
          titleTemplate="%s - React.js Boilerplate"
          defaultTitle="React.js Boilerplate"
        >
          <meta name="description" content="A React.js Boilerplate application" />
        </Helmet>
        <Header
          toggleModal={this.toggleModal}
        />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/features" component={FeaturePage} />
          <Route path="" component={NotFoundPage} />
        </Switch>
        {/* <Footer /> */}
        <GlobalStyle />
        <Web3ProviderModal 
          {...this.state} 
          toggleModal={this.toggleModal}
        />
      </AppWrapper>
    );
  }
}

export default App;