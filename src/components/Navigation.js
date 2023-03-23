import logo from "../assets/logo.svg";
import { ethers } from "ethers";

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };

  return (
    <nav className="flex w-full mt-2 p-2 mr-10">
      <ul className="flex space-x-24 text-xl px-16 w-4/12 mt-4">
        <li>
          <a href="#">Buy</a>
        </li>
        <li>
          <a href="#">Rent</a>
        </li>
        <li>
          <a href="#">Sell</a>
        </li>
      </ul>

      <div className="flex w-4/12 justify-center align-middle">
        <img src={logo} width={80} height={80} alt="Logo" />
        <h1 className="text-indigo-700 text-3xl font-bold pt-2">Meta NFT</h1>
      </div>
      <div className="flex w-4/12 justify-end px-16">
        {account ? (
          <button
            type="button"
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4  h-12 border border-blue-500 hover:border-transparent rounded"
          >
            {account.slice(0, 6) + "..." + account.slice(38, 42)}
          </button>
        ) : (
          <button
            type="button"
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4   h-12 border border-blue-500 hover:border-transparent rounded"
            onClick={connectHandler}
          >
            Connect
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
