import React from "react";
import PropTypes from "prop-types";
import Big from "big.js";

export default function Form({ onSubmit, currentUser }) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        <p>
          Sign the guest book,{" "}
          <a
            href={`https://wallet.testnet.near.org/profile/${currentUser?.account_id}`}
            target="_blank"
            className="current-user"
          >
            {currentUser.account_id}
          </a>
          !
        </p>
        <p>
          <label htmlFor="message">Message:</label>
          <textarea
            className="input-message"
            rows="4"
            autoComplete="off"
            autoFocus
            id="message"
            placeholder="Please input your greeting message."
            required
          />
        </p>
        <p>
          <label htmlFor="donation">Donation (optional):</label>
          <input
            autoComplete="off"
            defaultValue={"0"}
            id="donation"
            max={Big(currentUser.amount).div(10 ** 24)}
            min="0"
            step="0.01"
            type="number"
          />
          <span title="NEAR Tokens">Ⓝ</span>
        </p>
        <button type="submit" className="btn-sign">
          Sign
        </button>
      </fieldset>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  }),
};
