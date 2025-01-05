import { useState } from 'react';

function useDummyChecked() {
  const [data, setData] = useState(['a', 'b', 'c', 'd', 'e', 'y']);

  return {data, setData}; // Returning the state and the setter function
}

export default useDummyChecked;