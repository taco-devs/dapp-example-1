import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    width: 100%;
    line-height: 1.5;
    -webkit-user-select: none; /* Safari */        
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
    overflow-x: hidden;
  }

  body {
    font-family: 'Comfortaa', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Comfortaa','Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    min-height: 100vh;
    background: rgb(22,29,107);
    background: radial-gradient(circle, rgba(22,29,107,1) 0%, rgba(11,15,60,1) 100%);
    padding: 0 0 3em 0;
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

  .livenow {
    padding: 2px;
    height: 20px; 
    width: 20px;
  }

  .livenow > div {
    vertical-align: middle;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    position: absolute;
    margin: 0 auto;
    border:3px solid rgba(0,211,149,1);
    -webkit-animation: live 1.4s infinite ease-in-out;
    animation: live 1.4s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    &:nth-child(1) {
      background-color:rgba(0,211,149,0.3);
      background-color:rgba(0,211,149,1);
      -webkit-animation-delay: -0.1s;
      animation-delay: -0.1s;
    }
    &:nth-child(2) {
      -webkit-animation-delay: 0.16s;
      animation-delay: 0.16s;
    }
    &:nth-child(3) {
      -webkit-animation-delay: 0.42s;
      animation-delay: 0.42s;
      border:3px solid rgba(0,211,149,0.5);
    }
    &:nth-child(4) {
      border:3px solid rgba(0,211,149,1);
      -webkit-animation-delay: -0.42s;
      animation-delay: -0.42s;
    }
  }
  
  @-webkit-keyframes live {
    0%, 80%, 100% { -webkit-transform: scale(0.6) }
    40% { -webkit-transform: scale(1.0) }
  }
  @keyframes live {
    0%, 80%, 100% { 
      transform: scale(0.6);
      -webkit-transform: scale(0.6);
    } 40% { 
      transform: scale(1.0);
      -webkit-transform: scale(1.0);
    }
  }
  
  .content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    
    p {
      margin: 0 0 20px;
    }
    
  }
`;

export default GlobalStyle;
