import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from 'components/A';
import LocaleToggle from 'containers/LocaleToggle';
import messages from './messages';
import styled from 'styled-components';

import { Icon } from 'react-icons-kit';
import {twitter} from 'react-icons-kit/fa/twitter';
import {telegram} from 'react-icons-kit/fa/telegram';


const Wrapper = styled.footer`
  margin: 3em 0 0 0;
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 0.85em;
`;

const LeftSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const IconLink = styled.a`
  color: white;

  &:hover {
    cursor: pointer;
    color: #00d395;
  }
`

const StyledLabel = styled.p`
  margin: 0 2px 0 2px;
`

const StyledLink = styled.a`
  margin: 0 2px 0 2px;
  color: white;
`

const StyledIndicator = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: ${props => props.color || 'gray'};
  margin: 0 5px 0 5px;
`

const StatusSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 0 0.5em 0 0.5em;
`

const Indicator = ({health}) => {
  if (!health) {
    return <StyledIndicator />
  }
  if (health === 'healthy') {
    return <StyledIndicator color="#00d395"/>
  }
  if (health !== 'healthy') {
    return <StyledIndicator color="#fcf876"/>
  }
  
}


const query = `
{
  indexingStatusForCurrentVersion(subgraphName: "${process.env.GROWTH_GRAPH_NAME}") {
    synced
    health
    fatalError {
      message
      block {
        number
        hash
      }
      handler
    }
    chains {
      chainHeadBlock {
        number
      }
      latestBlock {
        number
      }
    }
  }
}
`



class Footer extends React.Component {

  state = {
    current_block: null,
    health: null,
    synced: null,
    error: null,
  }

  componentDidMount = () => {
    this.fetchStatus();
  }

  fetchStatus = () => {

    fetch(process.env.STATUS_URL, {method: 'POST', body: JSON.stringify({query})})
      .then(res => res.json())
      .then(json_res => {
        const {data} = json_res;
        const { indexingStatusForCurrentVersion } = data;
        this.setState({
          current_block: indexingStatusForCurrentVersion.chains[0].latestBlock.number,
          health: indexingStatusForCurrentVersion.health,
          synced: indexingStatusForCurrentVersion.synced,
        })
      })
      .catch(e => console.error(e));
  }



  render() {
    const {current_block, health, synced} = this.state;
    return (
      <Wrapper>
        <LeftSection>
          <IconLink href="https://twitter.com/GrowthDefi" target="_blank">
            <Icon icon={twitter} size="1.5em" style={{margin: '0 10px 0 10px'}}/>
          </IconLink>
          <IconLink href="https://t.me/growthdefi" target="_blank">
            <Icon icon={telegram} size="1.5em" style={{margin: '0 10px 0 10px'}}/>
          </IconLink>
          <StyledLabel>v{process.env.VERSION}</StyledLabel>
          <StatusSection> 
            <Indicator health={health} />
            <StyledLink href={`https://thegraph.com/explorer/subgraph/${process.env.GROWTH_GRAPH_NAME}`} target="_blank">Status</StyledLink>
            {health && health === 'healthy' && <StyledLabel>( Healthy )</StyledLabel>}
            {health && health !== 'healthy' && <StyledLabel>( Intermitent )</StyledLabel>}
          </StatusSection>
          {/* <LocaleToggle /> */}
        </LeftSection>
        <section>
          <FormattedMessage
            {...messages.copyright}
          />
        </section>
      </Wrapper>
    );
  }
}

export default Footer;
