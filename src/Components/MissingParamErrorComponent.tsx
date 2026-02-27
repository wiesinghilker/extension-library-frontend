import { Text } from "@mittwald/flow-remote-react-components";

// todo: purge?

export const MissingParamErrorComponent = () => {
  return (
    <>
      <Text>
        Das mStudio hat nicht alle benötigten Parameter an die Extension
        übermittelt.
      </Text>
    </>
  );
};
