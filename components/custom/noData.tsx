import React from "react";
import { FileQuestion } from "lucide-react";

const NoData = ({ message }: { message?: string }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <FileQuestion size={48} className="mb-4 text-gray-400" />
      {message || "No Data Available"}
    </div>
  );
};

export default NoData;
