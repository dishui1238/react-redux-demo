import React, { useState, useEffect, useReducer } from "react";

function HooksPage(props) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timeId = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timeId);
  }, [date]);
  return (
    <div>
      HooksPage
      <p>{date.toLocaleTimeString()}</p>
    </div>
  );
}

export default HooksPage;
