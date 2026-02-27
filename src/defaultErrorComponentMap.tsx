import { ReactNode } from "react";
import { AuthenticationErrorComponent } from "./Components/AuthenticationErrorComponent.js";
import { MissingParamErrorComponent } from "./Components/MissingParamErrorComponent.js";

export type ErrorMap = Record<string, (error: Error) => ReactNode>;

export const defaultErrorComponentMap: ErrorMap = {
  AuthenticationError: () => <AuthenticationErrorComponent />,
  MissingParamError: () => <MissingParamErrorComponent />,
};
