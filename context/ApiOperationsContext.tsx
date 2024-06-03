import { ReactNode, createContext } from "react";

export interface ApiOperations {
  getPriceRange: () => Promise<any>;
  getPriceSteps: () => Promise<any>;
}

interface ApiOperationsContext {
  operations: ApiOperations;
}

const ApiOperationsContext = createContext<ApiOperationsContext | undefined>(
  undefined
);

const ApiOperationsProvider = ({
  children,
  operations,
}: {
  children: ReactNode;
  operations: ApiOperations;
}) => {
  return (
    <ApiOperationsContext.Provider value={{ operations }}>
      {children}
    </ApiOperationsContext.Provider>
  );
};

export { ApiOperationsProvider };
export default ApiOperationsContext;
