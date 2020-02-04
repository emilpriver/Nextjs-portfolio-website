import React from "react";
import PropTypes from "prop-types";
import bodymovin from "lottie-web";

class LottieControl extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    const { url, loop, autoPlay } = this.props;
    bodymovin.loadAnimation({
      container: this.ref.current,
      renderer: "svg",
      loop,
      autoPlay,
      path: url
    });
  }

  render() {
    const { width, height } = this.props;
    return <div style={{ width, height }} ref={this.ref} {...this.props} />;
  }
}

LottieControl.propTypes = {
  url: PropTypes.string,
  autoPlay: PropTypes.bool,
  loop: PropTypes.bool,
  height: PropTypes.number,
  width: PropTypes.number
};

LottieControl.defaultProps = {
  url: "",
  autoPlay: false,
  loop: false,
  height: 400,
  width: 400
};

export default LottieControl;
