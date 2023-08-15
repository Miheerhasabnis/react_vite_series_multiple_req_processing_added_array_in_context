import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("content view loaded");
  }, []);

  return (
  <>
  <h1>my name is miheer</h1>
  </>
  );
}
