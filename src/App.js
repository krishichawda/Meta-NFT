import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Search from "./components/Search";
import Home from "./components/Home";

// ABIs
import RealEstate from "./abis/RealEstate.json";
import Escrow from "./abis/Escrow.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [escrow, setEscrow] = useState(null);

  const [account, setAccount] = useState(null);

  const [homes, setHomes] = useState([]);
  const [home, setHome] = useState({});
  const [toggle, setToggle] = useState(false);

  const loadBlockchainData = async () => {
    // console.log("helloooooooo");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();

    const realEstate = new ethers.Contract(
      config[network.chainId].realEstate.address,
      RealEstate,
      provider
    );
    const totalSupply = await realEstate.totalSupply();
    const h = [];

    for (var i = 1; i <= totalSupply; i++) {
      const uri = await realEstate.tokenURI(i);
      const response = await fetch(uri);
      const metadata = await response.json();
      h.push(metadata);
      console.log("working");
    }

    setHomes(h);

    console.log(homes);

    const escrow = new ethers.Contract(
      config[network.chainId].escrow.address,
      Escrow,
      provider
    );
    setEscrow(escrow);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  });

  const togglePop = (home) => {
    setHome(home);
    toggle ? setToggle(false) : setToggle(true);
  };

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search />

      <h3 className="text-lg px-5 mt-8">Homes For You</h3>

      <hr />

      <div className="grid grid-cols-3 gap-4">
        {!toggle &&
          homes.map((home, index) => (
            <div
              className="rounded-lg shadow-md cursor-pointer w-9/12 m-10"
              key={index}
              onClick={() => togglePop(home)}
            >
              <div className="relative h-48">
                <img
                  className="rounded-t-lg object-cover w-full h-full"
                  src={home.image}
                  alt="Home"
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-medium">
                  {home.attributes[0].value} ETH
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  <strong>{home.attributes[2].value}</strong> bds |
                  <strong>{home.attributes[3].value}</strong> ba |
                  <strong>{home.attributes[4].value}</strong> sqft
                </p>
                <p className="mt-2 font-medium text-gray-900">{home.address}</p>
              </div>
            </div>
          ))}
      </div>

      {toggle && (
        <Home
          home={home}
          provider={provider}
          account={account}
          escrow={escrow}
          togglePop={togglePop}
        />
      )}
    </div>
  );
}

export default App;
