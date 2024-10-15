import React, { useEffect, useState } from "react";

const TopHatEmbed = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="top-hat-embed loading-placeholder">
        {/* Placeholder or loading spinner */}
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="top-hat-embed">
      <p
        className="codepen"
        data-height="300"
        data-default-tab="result"
        data-slug-hash="abeJXXZ"
        data-pen-title="TOTH"
        data-user="thisyearnofear"
        style={{
          height: "300px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid",
          margin: "1em 0",
          padding: "1em",
        }}
      >
        <span>
          <a href="https://codepen.io/thisyearnofear/pen/abeJXXZ">
            The Hat Stays On 🎩
          </a>
        </span>
      </p>
      <script
        async
        src="https://cpwebassets.codepen.io/assets/embed/ei.js"
      ></script>
    </div>
  );
};

export default TopHatEmbed;
