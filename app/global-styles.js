import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
    -webkit-user-select: none; /* Safari */        
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
  }

  body {
    font-family: 'Comfortaa', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Comfortaa','Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background: rgb(22,29,107);
    background: radial-gradient(circle, rgba(22,29,107,1) 0%, rgba(11,15,60,1) 100%);
    padding: 0 0 8em 0;
  }

  p,
  label {
    font-family: 'Comfortaa', Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  h3 {
    font-family: 'Comfortaa';
    letter-spacing: 2px;
  }

  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      margin: 0; 
  }
`;

export default GlobalStyle;
