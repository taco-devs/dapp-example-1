import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from 'components/A';
import LocaleToggle from 'containers/LocaleToggle';
import messages from './messages';
import styled from 'styled-components';
import {FaTelegram, FaTwitter} from 'react-icons/fa'

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
  align-items: center;
`

const IconLink = styled.a`
  color: white;

  &:hover {
    cursor: pointer;
    color: #00d395;
  }
`

function Footer() {
  return (
    <Wrapper>
      <LeftSection>
        <IconLink href="https://twitter.com/GrowthDefi" target="_blank">
          <FaTwitter size="1.5em" style={{margin: '0 10px 0 10px'}}/>
        </IconLink>
        <IconLink href="https://t.me/growthdefi" target="_blank">
          <FaTelegram size="1.5em" style={{margin: '0 10px 0 10px'}}/>
        </IconLink>
        <LocaleToggle />
      </LeftSection>
      <section>
        <FormattedMessage
          {...messages.copyright}
        />
      </section>
    </Wrapper>
  );
}

export default Footer;
