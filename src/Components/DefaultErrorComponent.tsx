import { CodeBlock, Link, Text } from "@mittwald/flow-remote-react-components";
import { useRouteError } from "react-router";
import { getSupportEmail } from "../getSupportEmail.js";

export const DefaultErrorComponent = () => {
  const error = useRouteError();

  if (!(error instanceof Error)) {
    throw new Error("route error is no Error");
  }

  const supportEmail = getSupportEmail();

  return (
    <>
      <Text>
        Bitte lade die Seite neu, um es erneut zu versuchen. Folgender Fehler
        ist aufgetreten:
      </Text>
      <CodeBlock code={error.message} copyable />
      <Text>
        Möglicherweise handelt es sich dabei nur um ein temporäres Problem.
        Probiere es einfach in einigen Augenblicken nochmal.
      </Text>
      <Link
        href="."
        onPress={() => {
          window.location.reload();
        }}
      >
        Seite neuladen
      </Link>
      <Text>
        Wenn das Problem weiterhin auftritt, melde dich mit den Fehlerdetails
        bei unserem Support, dann unterstützen wir dich gerne.
      </Text>
      <Link
        href={`mailto:${supportEmail}?subject=${encodeURIComponent("Fehler in der Extension")}&body=${encodeURIComponent(`Folgender Fehler ist bei der Benutzung der Extension aufgetreten:\n\n${error.stack ?? error.message}\n\nDer Fehler ist auf folgender Seite aufgetreten:\n\n${window.location.href}`)}`}
      >
        {supportEmail}
      </Link>
    </>
  );
};
