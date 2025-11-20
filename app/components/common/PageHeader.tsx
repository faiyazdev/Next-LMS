import { ReactNode } from "react";

const PageHeader = ({ children }: { children: ReactNode }) => {
  return <h1 className="text-4xl font-bold">{children}</h1>;
};

export default PageHeader;
