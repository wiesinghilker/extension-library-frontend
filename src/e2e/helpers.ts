import { expect, Locator, Page, Download } from "@playwright/test";
import path from "path";
import fs from "fs";

export async function login(page: Page) {
  await page.goto("https://studio.mittwald.de");
  await expect(page).toHaveURL(/\/login$/);

  const emailField = page.getByRole("textbox", { name: "E-Mail-Adresse" });
  const passwordField = page.getByRole("textbox", { name: "Passwort" });

  await expect(emailField).toBeVisible();
  await emailField.fill(process.env.MSTUDIO_EMAIL ?? "");
  await passwordField.fill(process.env.MSTUDIO_PASSWORD ?? "");

  await page.getByRole("button", { name: "Anmelden" }).click();
  await page.waitForURL(/\/app\/dashboard$/);
}

export async function navigateToApp(page: Page, projectName: string, appName: string) {
  await page.getByRole("link", { name: "Projekte" }).click();
  await expect(page).toHaveURL(/\/app\/projects$/);

  await page.getByRole("row", { name: new RegExp(projectName) }).click();
  await expect(page).toHaveURL(/\/app\/projects\/.*\/dashboard$/);

  await page.getByRole("menuitem", { name: "Apps" }).click();
  await expect(page).toHaveURL(/\/app\/projects\/.*\/apps$/);

  await page.getByRole("row", { name: appName }).click();
  await expect(page).toHaveURL(/\/app\/projects\/.*\/apps\/.*\/general$/);
}

export async function navigateToEmailAddress(page: Page, projectName: string, emailAddress: string) {
  await page.getByRole("link", { name: "Projekte" }).click();
  await expect(page).toHaveURL(/\/app\/projects$/);

  await page.getByRole("row", { name: new RegExp(projectName) }).click();
  await expect(page).toHaveURL(/\/app\/projects\/.*\/dashboard$/);

  await page.getByRole("menuitem", { name: "E-Mails" }).click();
  await expect(page).toHaveURL(/\/app\/projects\/.*\/email\/addresses$/);

  await page.getByRole("row", { name: emailAddress }).click();
  await expect(page).toHaveURL(/\/app\/projects\/.*\/email\/addresses\/.*$/);
}

export async function navigateToExtension(
  page: Page,
  extensionName: string,
  headingName?: string | RegExp,
  projectName = "Frontend-Tests",
  targetName = "Frontend-Tests",
  targetType: "app" | "email" = "app",
) {
  await login(page);

  if (targetType === "app") {
    await navigateToApp(page, projectName, targetName);
  } else {
    await navigateToEmailAddress(page, projectName, targetName);
  }

  await page.getByRole("link", { name: extensionName }).click();
  if (headingName) {
    await expect(page.getByRole("heading", { name: headingName })).toBeVisible();
  }
}

export async function navigateToProject(page: Page, projectName: string) {
  await page.getByRole("link", { name: "Projekte" }).click();
  await expect(page).toHaveURL(/\/app\/projects$/);

  await page.getByRole("row", { name: new RegExp(projectName) }).click();
  await expect(page).toHaveURL(/\/app\/projects\/.*\/dashboard$/);
}

export async function navigateToProjectExtension(
  page: Page,
  projectName: string,
  extensionName: string,
  headingName: string | RegExp,
) {
  await login(page);
  await navigateToProject(page, projectName);
  await page.getByRole("menuitem", { name: extensionName }).click();
  await expect(page.getByRole("heading", { name: headingName })).toBeVisible();
}

export async function clickMultiple(locator: Locator, times: number) {
  for (let i = 0; i < times; i++) {
    await locator.click();
  }
}

export async function confirmDialog(
  page: Page,
  dialogName: string | RegExp,
  confirmButtonText: string,
) {
  const dialog = page.getByRole("dialog", { name: dialogName });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: confirmButtonText }).click();
  await expect(dialog).toBeHidden();
}

export async function deleteListItem(
  page: Page,
  rowLocator: Locator,
  menuItemName: string,
  dialogName: string,
) {
  await rowLocator.getByRole("button", { name: "Optionen" }).click();
  await page.getByRole("menuitem", { name: menuItemName }).click();
  await confirmDialog(page, dialogName, menuItemName);
  await expect(rowLocator).toBeHidden();
}

export async function ensureSwitchState(
  page: Page,
  switchLocator: Locator,
  labelText: string,
  shouldBeChecked: boolean,
) {
  await expect(switchLocator).toBeEnabled();
  const isChecked = await switchLocator.isChecked();
  if (isChecked !== shouldBeChecked) {
    await page.getByText(labelText).click();
    if (shouldBeChecked) {
      await expect(switchLocator).toBeChecked();
    } else {
      await expect(switchLocator).not.toBeChecked();
    }
  }
}

export async function ensureRadioState(
  page: Page,
  labelText: string,
  radioName: string,
) {
  const radio = page.getByRole("radio", { name: radioName });
  const isChecked = await radio.isChecked();
  if (!isChecked) {
    await page.getByText(labelText).click();
    await expect(radio).toBeChecked();
  }
}

export async function expectDownload(
  page: Page,
  triggerLocator: Locator,
  expectedFilename: string,
  minSizeBytes?: number,
): Promise<Download> {
  const downloadPromise = page.waitForEvent("download");
  await triggerLocator.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe(expectedFilename);

  if (minSizeBytes !== undefined) {
    const downloadPath = path.join("test-results", download.suggestedFilename());
    await download.saveAs(downloadPath);
    const stats = fs.statSync(downloadPath);
    expect(stats.size).toBeGreaterThan(minSizeBytes);
  }

  return download;
}
