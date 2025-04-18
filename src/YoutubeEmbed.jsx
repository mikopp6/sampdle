import PropTypes from "prop-types";

const YoutubeEmbed = ({ embedId, startTime }) => {
  const src = `https://www.youtube.com/embed/${embedId}?autoplay=1&controls=0&start=${startTime} `

  return (
    <div className="video">
      <iframe
        width="1000"
        height="600"
        src={src}
        loading="lazy"
        title="Embedded youtube"
      />
    </div>
  );
};

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
};

export default YoutubeEmbed;
