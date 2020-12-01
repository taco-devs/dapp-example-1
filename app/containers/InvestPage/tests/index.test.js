/**
 *
 * Tests for InvestPage
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl';
import NetworkData from 'contracts';
import 'jest-dom/extend-expect'; // add some helpful assertions

import { InvestPage } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';

import { AssetList } from '../components'

describe('Initial List', () => {

    it("Should render" , () => {

      const Network = NetworkData['eth'];
      const assets = Object.keys(NetworkData['eth'].available_assets);

      const {
        queryAllByText
      } = render(
        <AssetList
          pagination={0}
          search=""
          Network={Network}
          assets={assets}  
        />
      );
      
      // query* functions will return the element or null if it cannot be found
      // get* functions will return the element or throw an error if it cannot be found
      expect(queryAllByText('gcwBTC / cwBTC')).toBeInTheDocument()
    })
});
