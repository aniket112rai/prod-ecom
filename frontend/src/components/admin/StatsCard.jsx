

import React from "react";
const StatsCard = ({ title, value }) => {
  return (
    <div>
      <p className="text-slate-500 font-medium text-sm uppercase tracking-wider">{title}</p>
      <p className="text-4xl font-extrabold text-slate-900 mt-2">{value}</p>
    </div>
  );
};
export default StatsCard;