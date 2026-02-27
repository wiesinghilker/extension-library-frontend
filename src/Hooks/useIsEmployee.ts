import { useEffect, useState } from "react";
import { getSessionToken } from "@mittwald/ext-bridge/browser";

export const useIsEmployee = (apiBaseURL: string): boolean | undefined => {
  const [isEmployee, setIsEmployee] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const fetchEmployeeStatus = async () => {
      try {
        const sessionToken = await getSessionToken();
        const response = await fetch(`${apiBaseURL}/common/employee`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Session-Token": sessionToken,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = (await response.json()) as { isEmployee: boolean };

        setIsEmployee(data.isEmployee);
      } catch (error) {
        console.error("Error fetching employee status:", error);
        setIsEmployee(undefined);
      }
    };

    void fetchEmployeeStatus();
  }, []);

  return isEmployee;
};
