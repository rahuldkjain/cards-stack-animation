import React from "react";

const Copyright = () => {
  return (
    <a
      href="https://github.com/rahuldkjain"
      target="_blank"
      rel="noreferrer"
      className="copyright-container"
    >
      <div className="copyright">
        <div>
          developed by <span className="developer">Rahul Jain</span>
        </div>
        <div>
          <img
            src="https://rahuldkjain.github.io/rahul-avatar.png"
            alt="rahuldkjain avatar"
            width={24}
            height={24}
          />
        </div>
      </div>
    </a>
  );
};

export default Copyright;
