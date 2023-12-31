import { useEffect } from "react";

const TestComponent = ({ label }) => {
  useEffect(() => {
    console.log("on mount", label);

    return () => {
      console.log("on unmount", label);
    };
  }, []);
  return <div>{label}</div>;
};

export default TestComponent;
