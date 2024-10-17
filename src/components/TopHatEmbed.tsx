import React from "react";

const TopHatEmbed = () => {
  return (
    <div className="top-hat-embed">
      <iframe
        height="300"
        style={{ width: "100%" }}
        scrolling="no"
        title="TOTH"
        src="https://codepen.io/thisyearnofear/embed/abeJXXZ?default-tab=result"
        frameBorder="no"
        loading="lazy"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};

export default React.memo(TopHatEmbed);
