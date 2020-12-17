import {isMobile} from 'react-device-detect';

const getGasInfo = async (method, values, address, web3, value) => {
    try {
        const SAFE_MULTIPLIER = 1.15;
        const raw_gas = await method(...values).estimateGas({from: address, value});
        const gas = web3.utils.BN(raw_gas).mul(SAFE_MULTIPLIER);
        const raw_gasPrice = await web3.eth.getGasPrice();
        const gasPrice = web3.utils.BN(raw_gasPrice).mul(SAFE_MULTIPLIER); 
  
      return {gas, gasPrice};
    } catch(e) {
      console.log(e);
      return {
        gas: null, 
        gasPrice: null
      }
    }
}  

export const deposit = async (ContractInstance, connectionStatusChannel, _cost, address, asset, web3, functions) => {
    let stored_hash;
    const {gas, gasPrice} = await getGasInfo(ContractInstance.methods.deposit, [_cost], address, web3);
  
    return ContractInstance.methods.deposit(_cost).send({ from: address, gasPrice, gas})
      .on("transactionHash", (hash) => {
          stored_hash = hash;
          connectionStatusChannel.put(
            functions.addCurrentSwap({
              status: 'receipt',
              modal_type: 'mint',
              from: asset.from,
              to: asset.to,
              sending: asset.sending,
              receiving: asset.receiving,
              fromDecimals: asset.fromDecimals,
              toDecimals: asset.toDecimals,
              fromImage: asset.fromImage,
              toImage: asset.toImage,
              hash,
              progress: false,
            })
          )
      })
      .on("receipt",  (tx) => {
          // Send the confirmation receipt
          connectionStatusChannel.put(
            functions.addCurrentSwap({
              status: 'confirmed',
              modal_type: 'mint',
              from: asset.from,
              to: asset.to,
              sending: asset.sending,
              receiving: asset.receiving,
              fromDecimals: asset.fromDecimals,
              toDecimals: asset.toDecimals,
              fromImage: asset.fromImage,
              toImage: asset.toImage,
              hash: stored_hash,
              progress: true,
            })
          )
  
          // Timeout to autoclose the modal in 5s
          
          let timeout = isMobile ? 1000 : 5000;
          setTimeout(() => {
            connectionStatusChannel.put(functions.dismissSwap());
            connectionStatusChannel.put(functions.getBalances(address, web3));
          }, timeout)
      })
      .on("confirmation", (confirmation) => {
        // connectionStatusChannel.put(functions.dismissSwap()); 
      })
      .on("error", async function () {
          console.log("Error");
      });
}


export const bridge_deposit = async (ContractInstance, connectionStatusChannel, _cost, growthToken, address, asset, web3, functions) => {
    let stored_hash;

    const {gas, gasPrice} = await getGasInfo(ContractInstance.methods.deposit, [growthToken], address, web3, _cost);
  
    return ContractInstance.methods.deposit(growthToken).send({ from: address, gasPrice, gas, value: _cost})
      .on("transactionHash", (hash) => {
          stored_hash = hash;
          connectionStatusChannel.put(
            functions.addCurrentSwap({
              status: 'receipt',
              modal_type: 'mint',
              from: asset.from,
              to: asset.to,
              sending: asset.sending,
              receiving: asset.receiving,
              fromDecimals: asset.fromDecimals,
              toDecimals: asset.toDecimals,
              fromImage: asset.fromImage,
              toImage: asset.toImage,
              hash,
              progress: false,
            })
          )
      })
      .on("receipt",  (tx) => {
          // Send the confirmation receipt
          connectionStatusChannel.put(
            functions.addCurrentSwap({
              status: 'confirmed',
              modal_type: 'mint',
              from: asset.from,
              to: asset.to,
              sending: asset.sending,
              receiving: asset.receiving,
              fromDecimals: asset.fromDecimals,
              toDecimals: asset.toDecimals,
              fromImage: asset.fromImage,
              toImage: asset.toImage,
              hash: stored_hash,
              progress: true,
            })
          )
  
          // Timeout to autoclose the modal in 5s
          
          let timeout = isMobile ? 1000 : 3000;
          setTimeout(() => {
            connectionStatusChannel.put(functions.dismissSwap());
            connectionStatusChannel.put(functions.getBalances(address, web3));
          }, timeout)
      })
      .on("confirmation", (confirmation) => {
        // connectionStatusChannel.put(functions.dismissSwap()); 
      })
      .on("error", async function () {
          console.log("Error");
      });
}


export const deposit_underlying = async (ContractInstance, connectionStatusChannel, _cost, address, asset, web3, functions) => {
    let stored_hash;
    const {gas, gasPrice} = await getGasInfo(ContractInstance.methods.depositUnderlying, [_cost], address, web3);

    return ContractInstance.methods.depositUnderlying(_cost).send({ from: address, gas, gasPrice})
    .on("transactionHash", (hash) => {
        stored_hash = hash;
        connectionStatusChannel.put(
        functions.addCurrentSwap({
            status: 'receipt',
            modal_type: 'mint',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash,
            progress: false,
        })
        )
    })
    .on("receipt",  (tx) => {
        // Send the confirmation receipt
        connectionStatusChannel.put(
        functions.addCurrentSwap({
            status: 'confirmed',
            modal_type: 'mint',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash: stored_hash,
            progress: true,
        })
        )

        // Timeout to autoclose the modal in 5s
        let timeout = isMobile ? 1000 : 5000;
        setTimeout(() => {
            connectionStatusChannel.put(functions.dismissSwap());
            connectionStatusChannel.put(functions.getBalances(address, web3));
        }, timeout)
    })
    .on("confirmation", (confirmation) => {
    // connectionStatusChannel.put(functions.dismissSwap()); 
    })
    .on("error", async function () {
        console.log("Error");
    });
}

export const bridge_deposit_underlying = async (ContractInstance, connectionStatusChannel, _cost, growthToken, address, asset, web3, functions) => {
    let stored_hash;
    const {gas, gasPrice} = await getGasInfo(ContractInstance.methods.depositUnderlying, [growthToken], address, web3, _cost);

    return ContractInstance.methods.depositUnderlying(growthToken).send({ from: address, gas, gasPrice, value: _cost})
    .on("transactionHash", (hash) => {
        stored_hash = hash;
        connectionStatusChannel.put(
        functions.addCurrentSwap({
            status: 'receipt',
            modal_type: 'mint',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash,
            progress: false,
        })
        )
    })
    .on("receipt",  (tx) => {
        // Send the confirmation receipt
        connectionStatusChannel.put(
        functions.addCurrentSwap({
            status: 'confirmed',
            modal_type: 'mint',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash: stored_hash,
            progress: true,
        })
        )

        // Timeout to autoclose the modal in 5s
        let timeout = isMobile ? 1000 : 5000;
        setTimeout(() => {
        connectionStatusChannel.put(functions.dismissSwap());
        connectionStatusChannel.put(functions.getBalances(address, web3));
        }, timeout)
    })
    .on("confirmation", (confirmation) => {
    // connectionStatusChannel.put(functions.dismissSwap()); 
    })
    .on("error", async function () {
        console.log("Error");
    });
}


export const withdraw = async (ContractInstance, connectionStatusChannel, _cost, address, asset, web3, functions) => {
    let stored_hash;
    const {gas, gasPrice} = await getGasInfo(ContractInstance.methods.withdraw, [_cost], address, web3);
    return ContractInstance.methods.withdraw(_cost).send({ from: address, gas, gasPrice})
      .on("transactionHash", (hash) => {
          stored_hash = hash;
          connectionStatusChannel.put(
            functions.addCurrentSwap({
              status: 'receipt',
              modal_type: 'redeem',
              from: asset.from,
              to: asset.to,
              sending: asset.sending,
              receiving: asset.receiving,
              fromDecimals: asset.fromDecimals,
              toDecimals: asset.toDecimals,
              fromImage: asset.fromImage,
              toImage: asset.toImage,
              hash,
              progress: false,
            })
          )
      })
      .on("receipt",  (tx) => {
          // Send the confirmation receipt
          connectionStatusChannel.put(
            functions.addCurrentSwap({
              status: 'confirmed',
              modal_type: 'redeem',
              from: asset.from,
              to: asset.to,
              sending: asset.sending,
              receiving: asset.receiving,
              fromDecimals: asset.fromDecimals,
              toDecimals: asset.toDecimals,
              fromImage: asset.fromImage,
              toImage: asset.toImage,
              hash: stored_hash,
              progress: true,
            })
          )
  
          // Timeout to autoclose the modal in 5s
          let timeout = isMobile ? 1000 : 5000;
          setTimeout(() => {
            connectionStatusChannel.put(functions.dismissSwap());
            connectionStatusChannel.put(functions.getBalances(address, web3));
          }, timeout)
      })
      .on("confirmation", (confirmation) => {
        // connectionStatusChannel.put(functions.dismissSwap()); 
      })
      .on("error", async function () {
          console.log("Error");
      });
}

export const withdraw_bridge = async (ContractInstance, connectionStatusChannel, _grossShares, growthToken, address, asset, web3, functions) => {
    let stored_hash;
    const {gas, gasPrice} = await getGasInfo(ContractInstance.methods.withdraw, [growthToken, _grossShares], address, web3);
    return ContractInstance.methods.withdraw(growthToken, _grossShares).send({ from: address, gas, gasPrice})
      .on("transactionHash", (hash) => {
          stored_hash = hash;
          connectionStatusChannel.put(
            functions.addCurrentSwap({
              status: 'receipt',
              modal_type: 'redeem',
              from: asset.from,
              to: asset.to,
              sending: asset.sending,
              receiving: asset.receiving,
              fromDecimals: asset.fromDecimals,
              toDecimals: asset.toDecimals,
              fromImage: asset.fromImage,
              toImage: asset.toImage,
              hash,
              progress: false,
            })
          )
      })
      .on("receipt",  (tx) => {
          // Send the confirmation receipt
          connectionStatusChannel.put(
            functions.addCurrentSwap({
              status: 'confirmed',
              modal_type: 'redeem',
              from: asset.from,
              to: asset.to,
              sending: asset.sending,
              receiving: asset.receiving,
              fromDecimals: asset.fromDecimals,
              toDecimals: asset.toDecimals,
              fromImage: asset.fromImage,
              toImage: asset.toImage,
              hash: stored_hash,
              progress: true,
            })
          )
  
          // Timeout to autoclose the modal in 5s
          let timeout = isMobile ? 1000 : 5000;
          setTimeout(() => {
            connectionStatusChannel.put(functions.dismissSwap());
            connectionStatusChannel.put(functions.getBalances(address, web3));
          }, timeout)
      })
      .on("confirmation", (confirmation) => {
        // connectionStatusChannel.put(functions.dismissSwap()); 
      })
      .on("error", async function () {
          console.log("Error");
      });
}


export const withdraw_underlying = async (ContractInstance, connectionStatusChannel, _cost, address, asset, web3, functions) => {
    let stored_hash;
    const {gas, gasPrice} = await getGasInfo(ContractInstance.methods.withdrawUnderlying, [_cost], address, web3);
    return ContractInstance.methods.withdrawUnderlying(_cost).send({ from: address, gas, gasPrice})
        .on("transactionHash", (hash) => {
        stored_hash = hash;
        connectionStatusChannel.put(
        functions.addCurrentSwap({
            status: 'receipt',
            modal_type: 'redeem',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash,
            progress: false,
        })
        )
    })
    .on("receipt",  (tx) => {
        // Send the confirmation receipt
        connectionStatusChannel.put(
        functions.addCurrentSwap({
            status: 'confirmed',
            modal_type: 'redeem',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash: stored_hash,
            progress: true,
        })
        )

        // Timeout to autoclose the modal in 5s
        let timeout = isMobile ? 1000 : 5000;
        setTimeout(() => {
        connectionStatusChannel.put(functions.dismissSwap());
        connectionStatusChannel.put(functions.getBalances(address, web3));
        }, timeout)
    })
    .on("confirmation", (confirmation) => {
    // connectionStatusChannel.put(functions.dismissSwap()); 
    })
    .on("error", async function () {
        console.log("Error");
    });
}
  


export const withdraw_underlying_bridge = async (ContractInstance, connectionStatusChannel, _grossShares, growthToken, address, asset, web3, functions) => {
    let stored_hash;
    const {gas, gasPrice} = await getGasInfo(ContractInstance.methods.withdrawUnderlying, [growthToken, _grossShares], address, web3);
    return ContractInstance.methods.withdrawUnderlying(growthToken, _grossShares).send({ from: address, gas, gasPrice})
        .on("transactionHash", (hash) => {
        stored_hash = hash;
        connectionStatusChannel.put(
        functions.addCurrentSwap({
            status: 'receipt',
            modal_type: 'redeem',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash,
            progress: false,
        })
        )
    })
    .on("receipt",  (tx) => {
        // Send the confirmation receipt
        connectionStatusChannel.put(
        functions.addCurrentSwap({
            status: 'confirmed',
            modal_type: 'redeem',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash: stored_hash,
            progress: true,
        })
        )

        // Timeout to autoclose the modal in 5s
        let timeout = isMobile ? 1000 : 5000;
        setTimeout(() => {
        connectionStatusChannel.put(functions.dismissSwap());
        connectionStatusChannel.put(functions.getBalances(address, web3));
        }, timeout)
    })
    .on("confirmation", (confirmation) => {
    // connectionStatusChannel.put(functions.dismissSwap()); 
    })
    .on("error", async function () {
        console.log("Error");
    });
}
  