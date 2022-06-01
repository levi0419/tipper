import "./App.css";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import Add from "./components/Add";
import Body from "./components/Body";
import Header from "./components/Header";

import ierc from "./contracts/ierc.abi.json";
import tipper from "./contracts/Tipper.abi.json";

const ERC20_DECIMALS = 18;

const tipperAddress = "0x095416ed9Baf77a016a25105FE68BAB19D0Eb755";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
  const [usdBalance, setUsdBalance] = useState(0);
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [staffs, setStaffs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      return getUSDBalance();
    } else {
      console.log("no kit or address");
    }
  }, [kit, address]);

  useEffect(() => {
    if (contract) {
      isUserAdmin();
      getStaffs();
    }
  }, [contract]);

  const connectWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        // notificationOff()
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log("There is an error");
        console.log({ error });
      }
    } else {
      console.log("please install the extension");
    }
  };

  const getUSDBalance = async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
      console.log(USDBalance);
      const contract = new kit.web3.eth.Contract(tipper, tipperAddress);
      setcontract(contract);
      setUsdBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  };

  const getStaffs = async () => {
    try {
      const staffLength = await contract.methods.getStaffLength().call();
      const _staffs = [];

      for (let index = 0; index < staffLength; index++) {
        let _staff = new Promise(async (resolve, reject) => {
          try {
            let staff = await contract.methods.getStaff(index).call();
            resolve({
              index: index,
              owner: staff[0],
              name: staff[1],
              image: staff[2],
              bio: staff[3],
              age: staff[4],
              jobDescription: staff[5],
              totalAmount: staff[6],
            });
          } catch (error) {
            console.log("User is not Admin");
          }
        });
        _staffs.push(_staff);
      }
      const staffs = await Promise.all(_staffs);
      setStaffs(staffs);
    } catch (error) {
      console.log(error);
    }
  };

  const isUserAdmin = async () => {
    try {
      const isAdmin = await contract.methods.isUserAdmin(address).call();
      setIsAdmin(isAdmin);
    } catch (error) {
      console.log(error);
    }
  };

  const add = async (data) => {
    console.log(data);
    const { name, age, image, bio, jobDescription } = data;
    try {
      await contract.methods
        .addStaff(name, image, bio, age, jobDescription)
        .send({ from: address });
      getStaffs();
    } catch (error) {
      console.log(error);
    }
  };

  const submitTip = async (index, _tip) => {
    const cUSDContract = new kit.web3.eth.Contract(ierc, cUSDContractAddress);
    const tip = new BigNumber(_tip).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await cUSDContract.methods
        .approve(tipperAddress, tip)
        .send({ from: address });
      await contract.methods.tipStaff(index, tip).send({ from: address });
      getStaffs()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container py-3">
      <Header balance={usdBalance} />
      <Body staffs={staffs} tipper={submitTip} />
      {isAdmin ? <Add add={add} />: <h2>Only Admins can add Staff</h2> }
    </div>
  );
}

export default App;
