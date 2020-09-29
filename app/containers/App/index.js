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
import { connect } from 'react-redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import InvestPage from 'containers/InvestPage/Loadable';
import BalancePage from 'containers/BalancePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import GrowthStats from 'containers/GrowthStats/Loadable';
import Header from 'components/Header';
import Navbar from 'components/Navbar';
import StatsContainer from 'components/StatsContainer';
import Web3ProviderModal from 'components/Web3ProviderModal';
import Footer from 'components/Footer';
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getChainData } from '../../utils/utilities';

import NetworkData from 'contracts';

import reducer from './reducer';
import { setupNetwork } from './actions'
import { makeSelectCurrrentNetwork } from './selectors';

import GlobalStyle from '../../global-styles';

// Import contracts
import GrowToken from 'contracts/GrowToken.json';


const AppWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

const NetworkChainIds = {
  1:'eth',
  3:'ropsten',
  4:'rinkeby',
  42: 'kovan',
}

// Initial State
const INITIAL_STATE = {
  fetching: false,
  address: null,
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
      providerOptions: this.getProviderOptions()
    })
  }

  // Detect if there is a cached provider
  componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      //this.resetApp()
      this.onConnect();
    }

    // Load Growth Token Contract

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

  // Load Contracts
  loadContracts = async (web3, network_id) => {

  
    // Get the correct network
    this.props.setupNetwork(network_id);
    const Network = NetworkData[network_id];

    // Change for environment variables
    if (Network.growth_token) {
      const GrowTokenInstance = await new web3.eth.Contract(Network.growth_token.abi, Network.growth_token.address);
      this.setState({GrowTokenInstance});
    }
    
  }

  // On Connect Wallet 
  onConnect = async () => {
    const provider = await this.web3Modal.connect();

    await this.subscribeProvider(provider);

    const web3 = this.initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    const network_id = NetworkChainIds[networkId];

    await this.loadContracts(web3, network_id);

    await this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId,
      network_id
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
  toggleModal = () => {
    this.onConnect();
    // this.setState({ showModal: !this.state.showModal });
  }

  // Providers
  getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: '9619f128da304b1c99b821758dc58bb5' // process.env.REACT_APP_INFURA_ID
        }
      },
      /* torus: {
        package: Torus
      },
      fortmatic: {
        package: Fortmatic,
        options: {
          key: process.env.REACT_APP_FORTMATIC_KEY
        }
      },
      authereum: {
        package: Authereum
      },
      unilogin: {
        package: UniLogin
      } */
    };
    return providerOptions;
  };

  // Reset
  resetApp = async () => {
    const { web3 } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    this.setState({ ...INITIAL_STATE });
  };


  render () {
    return (
      <AppWrapper>
        <Helmet
          titleTemplate="%s - GROWTH DeFi"
          defaultTitle="GROWTH DeFi - Dashboard"
        >
          <meta name="description" content="Liquidity DeFi Protocol" />
        </Helmet>
        <Header
          {...this.state}
          toggleModal={this.toggleModal}
          resetApp={this.resetApp}
        />
        <GrowthStats {...this.state} />
        <Navbar />
        <Switch>
          <Route 
            exact 
            path="/" 
            render={(props) => (
              <InvestPage 
                {...props}
                {...this.state}
              />
            )}
          />
          <Route 
            path="/balance" 
            render={(props) => (
              <BalancePage 
                {...props}
                {...this.state}
              />
            )}
          />
          <Route path="" component={NotFoundPage} />
        </Switch>
        <Footer />
        <GlobalStyle />
      </AppWrapper>
    );
  }
}

//export default App;

const withReducer = injectReducer({ key: 'global', reducer });

const mapStateToProps = createStructuredSelector({
  network: makeSelectCurrrentNetwork()
});

function mapDispatchToProps(dispatch) {
  return {
    setupNetwork: (network) => dispatch(setupNetwork(network))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
    withReducer,
    withConnect,
  )(App);
