import React, { useEffect, useState } from "react";

const BaseGlobeEmbed = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="base-globe-embed loading-placeholder">
        {/* Placeholder or loading spinner */}
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="base-globe-embed">
      <p
        className="codepen"
        data-height="300"
        data-theme-id="light"
        data-default-tab="result"
        data-slug-hash="oNKZREY"
        data-pen-title="BaseGlobe"
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
          <a href="https://codepen.io/thisyearnofear/pen/oNKZREY">
            BaseGlobe 🔵
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

export default BaseGlobeEmbed;
