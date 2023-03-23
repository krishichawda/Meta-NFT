import { ethers } from "ethers";
import { useEffect, useState } from "react";

import close from "../assets/close.svg";

const Home = ({ home, provider, account, escrow, togglePop }) => {
  const [hasBought, setHasBought] = useState(false);
  const [hasLended, setHasLended] = useState(false);
  const [hasInspected, setHasInspected] = useState(false);
  const [hasSold, setHasSold] = useState(false);

  const [buyer, setBuyer] = useState(null);
  const [lender, setLender] = useState(null);
  const [inspector, setInspector] = useState(null);
  const [seller, setSeller] = useState(null);

  const [owner, setOwner] = useState(null);

  const fetchDetails = async () => {
    // -- Buyer

    const buyer = await escrow.buyer(home.id);
    setBuyer(buyer);

    const hasBought = await escrow.approval(home.id, buyer);
    setHasBought(hasBought);

    // -- Seller

    const seller = await escrow.seller();
    setSeller(seller);

    const hasSold = await escrow.approval(home.id, seller);
    setHasSold(hasSold);

    // -- Lender

    const lender = await escrow.lender();
    setLender(lender);

    const hasLended = await escrow.approval(home.id, lender);
    setHasLended(hasLended);

    // -- Inspector

    const inspector = await escrow.inspector();
    setInspector(inspector);

    const hasInspected = await escrow.inspectionPassed(home.id);
    setHasInspected(hasInspected);
  };

  const fetchOwner = async () => {
    if (await escrow.isListed(home.id)) return;

    const owner = await escrow.buyer(home.id);
    setOwner(owner);
  };

  const buyHandler = async () => {
    const escrowAmount = await escrow.escrowAmount(home.id);
    const signer = await provider.getSigner();

    // Buyer deposit earnest
    let transaction = await escrow
      .connect(signer)
      .depositEarnset(home.id, { value: escrowAmount });
    await transaction.wait();

    // Buyer approves...
    transaction = await escrow.connect(signer).approveSale(home.id);
    await transaction.wait();

    setHasBought(true);
  };
  const inspectHandler = async () => {
    const signer = await provider.getSigner();

    // Inspector updates status
    const transaction = await escrow
      .connect(signer)
      .updateInspectionStatus(home.id, true);
    await transaction.wait();

    setHasInspected(true);
  };

  const lendHandler = async () => {
    const signer = await provider.getSigner();

    // Lender approves...
    const transaction = await escrow.connect(signer).approveSale(home.id);
    await transaction.wait();

    // Lender sends funds to contract...
    const lendAmount =
      (await escrow.purchasePrice(home.id)) -
      (await escrow.escrowAmount(home.id));
    await signer.sendTransaction({
      to: escrow.address,
      value: lendAmount.toString(),
      gasLimit: 60000,
    });

    setHasLended(true);
  };

  const sellHandler = async () => {
    const signer = await provider.getSigner();

    // Seller approves...
    let transaction = await escrow.connect(signer).approveSale(home.id);
    await transaction.wait();

    // Seller finalize...
    transaction = await escrow.connect(signer).finalizeSale(home.id);
    await transaction.wait();

    setHasSold(true);
  };

  useEffect(() => {
    fetchDetails();
    fetchOwner();
  }, [hasSold]);

  return (
    <div className="bg-white rounded-xl shadow-lg w-10/12 mx-auto relative">
      <div className="flex mt-5">
        <div className="p-4">
          <img src={home.image} alt="Home" className="w-full" />
        </div>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">{home.name}</h1>
          <p className="text-gray-700 mb-2">
            <strong>{home.attributes[2].value}</strong> bds |
            <strong>{home.attributes[3].value}</strong> ba |
            <strong>{home.attributes[4].value}</strong> sqft
          </p>
          <p className="text-gray-700 mb-4">{home.address}</p>

          <h2 className="text-2xl font-bold mb-2">
            {home.attributes[0].value} ETH
          </h2>

          {owner ? (
            <div className="text-gray-700 mb-4">
              Owned by {owner.slice(0, 6) + "..." + owner.slice(38, 42)}
            </div>
          ) : (
            <div>
              {account === inspector ? (
                <button
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 mr-4"
                  onClick={inspectHandler}
                  disabled={hasInspected}
                >
                  Approve Inspection
                </button>
              ) : account === lender ? (
                <button
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 mr-4"
                  onClick={lendHandler}
                  disabled={hasLended}
                >
                  Approve &amp; Lend
                </button>
              ) : account === seller ? (
                <button
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 mr-4"
                  onClick={sellHandler}
                  disabled={hasSold}
                >
                  Approve &amp; Sell
                </button>
              ) : (
                <button
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 mr-4"
                  onClick={buyHandler}
                  disabled={hasBought}
                >
                  Buy
                </button>
              )}

              <button className="bg-white border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded mb-4">
                Contact agent
              </button>
            </div>
          )}

          <hr className="my-4" />

          <h2 className="text-2xl font-bold mb-2">Overview</h2>

          <p className="text-gray-700 mb-4">{home.description}</p>

          <hr className="my-4" />

          <h2 className="text-2xl font-bold mb-2">Facts and features</h2>

          <ul className="list-disc pl-4">
            {home.attributes.map((attribute, index) => (
              <li key={index} className="text-gray-700 mb-2">
                <strong>{attribute.trait_type}</strong>: {attribute.value}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={togglePop}
          className="absolute top-0 right-0 mt-4 mr-4"
        >
          <img src={close} alt="Close" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Home;
