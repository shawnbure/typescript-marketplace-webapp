import LoadingBar from "react-top-loading-bar";

const LoadProgressiveBar = (props: any) => {
    let { barColor, loadStep } = props;
    return <LoadingBar color={barColor} progress={loadStep} />;
};

export default LoadProgressiveBar;
