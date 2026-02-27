import {
  Accordion,
  CodeBlock,
  Content,
  Heading,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";
import { useRouteError } from "react-router";

export const ErrorDeveloperDetails = () => {
  const error = useRouteError();

  if (!(error instanceof Error) || !error.stack) {
    return <></>;
  }

  return (
    <Accordion variant="outline">
      <Heading>Fehlerdetails für den Support</Heading>
      <Content>
        <Section>
          <Text>
            Unsere Entwickler freuen sich, wenn du ihnen diese Fehlerdetails
            mitteilst.
          </Text>
          <CodeBlock
            copyable
            code={`${window.location.href}\n\n${error.stack}`}
          />
        </Section>
      </Content>
    </Accordion>
  );
};
