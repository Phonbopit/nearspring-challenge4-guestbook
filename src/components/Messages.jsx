import React from "react";
import PropTypes from "prop-types";
import { identicon } from "minidenticons";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const NANO_SECOND_TIMESTAMP = 1 * 10 ** 6;
const FORMAT_DATE = "DD MMM YYYY HH:mm:ss";

export default function Messages({ messages }) {
  let sortedMessages = messages.sort((a, b) => b.created_at - a.created_at);

  return (
    <>
      <h2>Messages</h2>

      <div className="messages-box">
        {sortedMessages.map((message, i) => {
          const iden = identicon(message.sender);
          return (
            <div
              className={`box ${message.premium ? "is-premium" : ""}`}
              key={i}
            >
              <div className="is-flex is-center">
                <span
                  className="identicon"
                  dangerouslySetInnerHTML={{ __html: iden }}
                ></span>
                <span className="sender">{message.sender}</span>
                <span className="timeago">
                  {dayjs(message.created_at / NANO_SECOND_TIMESTAMP).fromNow()}
                </span>
              </div>
              <div className="message">
                <p>{message.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

Messages.propTypes = {
  messages: PropTypes.array,
};
