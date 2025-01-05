import  { useState } from "react";

function useLineData() {
  const [lineData, setLineData] = useState([["a", "b", "c", "d", "e"]]);

  return { lineData, setLineData };
}

export default useLineData;
