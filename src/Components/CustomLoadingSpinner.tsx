import { Flex, LoadingSpinner, Text } from "@mittwald/flow-remote-react-components";

export const CustomLoadingSpinner = (props: { text: string }) => {
  return (
    <Flex direction="row" align="center" gap="s">
      <LoadingSpinner size="m" />
      <Text>{props.text} ...</Text>
    </Flex>
  );
};
