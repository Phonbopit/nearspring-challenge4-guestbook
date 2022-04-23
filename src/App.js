import "regenerator-runtime/runtime";
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { providers, utils } from "near-api-js";
import Big from "big.js";

import Form from "./components/Form";
import SignIn from "./components/SignIn";
import Messages from "./components/Messages";
import { useWalletSelector } from "./contexts/WalletSelectorContext";

const SUGGESTED_DONATION = "0";
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const App = () => {
  const { selector, accounts, accountId, setAccountId } = useWalletSelector();

  const [account, setAccount] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAccount = useCallback(async () => {
    if (!accountId) {
      return null;
    }

    const { nodeUrl } = selector.network;
    const provider = new providers.JsonRpcProvider({ url: nodeUrl });

    return provider
      .query({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector.network]);

  const getMessages = useCallback(() => {
    const provider = new providers.JsonRpcProvider({
      url: selector.network.nodeUrl,
    });

    return provider
      .query({
        request_type: "call_function",
        account_id: selector.getContractId(),
        method_name: "getMessages",
        args_base64: "",
        finality: "optimistic",
      })
      .then((res) => JSON.parse(Buffer.from(res.result).toString()));
  }, [selector]);

  useEffect(() => {
    if (!accountId) {
      return setAccount(null);
    }

    setIsLoading(true);

    getAccount().then((nextAccount) => {
      setAccount(nextAccount);
      setIsLoading(false);
    });
  }, [accountId, getAccount]);

  useEffect(() => {
    getMessages().then(setMessages);
  }, []);

  const handleSignIn = () => {
    selector.show();
  };

  const handleSignOut = () => {
    selector.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
  };

  const handleSwitchProvider = () => {
    selector.show();
  };

  const handleSwitchAccount = () => {
    const currentIndex = accounts.findIndex((x) => x.accountId === accountId);
    const nextIndex = currentIndex < accounts.length - 1 ? currentIndex + 1 : 0;

    const nextAccountId = accounts[nextIndex].accountId;

    setAccountId(nextAccountId);
    alert("Switched account to " + nextAccountId);
  };

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const { fieldset, message, donation } = e.target.elements;

      fieldset.disabled = true;

      setIsLoading(true);

      selector
        .signAndSendTransaction({
          signerId: accountId,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "addMessage",
                args: { text: message.value },
                gas: BOATLOAD_OF_GAS,
                deposit: utils.format.parseNearAmount(donation.value || "0"),
              },
            },
          ],
        })
        .catch((err) => {
          alert("Failed to add message");
          console.log("Failed to add message");

          throw err;
        })
        .then(() => {
          return getMessages()
            .then((nextMessages) => {
              setMessages(nextMessages);
              message.value = "";
              donation.value = SUGGESTED_DONATION;
              fieldset.disabled = false;
              message.focus();
            })
            .catch((err) => {
              alert("Failed to refresh messages");
              console.log("Failed to refresh messages");

              throw err;
            });
        })
        .catch((err) => {
          console.error(err);

          fieldset.disabled = false;
        });
    },
    [selector, accountId, getMessages]
  );

  return (
    <main className="container is-max-desktop mt-4">
      <header className="section hero mt-4">
        <h1 className="title">
          NEAR Guest Book <span className="tag is-danger">Testnet</span>
        </h1>
        {account ? (
          <button onClick={handleSignOut}>Log out</button>
        ) : (
          <button onClick={handleSignIn}>Log in</button>
        )}
      </header>
      {account ? (
        <Form onSubmit={onSubmit} currentUser={account} />
      ) : (
        <SignIn />
      )}
      {!!account && !!messages.length && <Messages messages={messages} />}
    </main>
  );
};

export default App;
