import React, { useEffect, useState } from "react";

const BaseGlobeEmbed = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load CodePen embed script
    const script = document.createElement("script");
    script.src = "https://cpwebassets.codepen.io/assets/embed/ei.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="base-globe-embed loading-placeholder">
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
      >
        <span>
          <a href="https://codepen.io/thisyearnofear/pen/oNKZREY">
            BaseGlobe 🔵
          </a>
        </span>
      </p>
    </div>
  );
};

export default BaseGlobeEmbed;
