import { useState } from 'react';

function useDummyChecked() {
  const [data, setData] = useState(['d', 'y']);

  return {data, setData}; // Returning the state and the setter function
}

export default useDummyChecked;