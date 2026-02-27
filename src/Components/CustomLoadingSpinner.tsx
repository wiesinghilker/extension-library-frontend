import {
  ColumnLayout,
  LoadingSpinner,
  Text,
} from "@mittwald/flow-remote-react-components";

export const CustomLoadingSpinner = (props: { text: string }) => {
  return (
    <ColumnLayout>
      <LoadingSpinner height={100} />{" "}
      <Text style={{ marginLeft: 10 }}>{props.text} ...</Text>
    </ColumnLayout>
  );
};
