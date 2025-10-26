import { Button } from "@/components/ui/button";
import React, { ReactNode } from "react";

const ButtonStepNav = ({
  handleClick,
  children,
}: {
  children: ReactNode;
  handleClick: () => void;
}) => {
  return (
    <Button
      variant="ghost"
      className="!text-primary font-sans"
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default ButtonStepNav;
