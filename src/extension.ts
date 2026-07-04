'use strict';

import * as vscode from 'vscode';
import * as commands from './commands';
import { detectConfigChanges } from './helpers/changeDetection';
import { setExtensionContext } from './helpers/index';
import { checkThemeStatus, versionKey } from './helpers/versioning';
import * as i18n from './i18n';
import { showStartMessages } from './messages/start';

/**
 * This method is called when the extension is activated.
 * It initializes the core functionality of the extension.
 */
export const activate = async (context: vscode.ExtensionContext) => {
  try {
    // Capture the context first: the config/versioning helpers resolve the
    // extension's own identity through it, and both checkThemeStatus and
    // detectConfigChanges below depend on that being available.
    setExtensionContext(context);

    await i18n.initTranslations();
    context.globalState.setKeysForSync([versionKey]);
    const status = await checkThemeStatus(context.globalState);
    showStartMessages(status);

    // Subscribe to the extension commands
    context.subscriptions.push(...commands.registered);

    // Initially trigger the config change detection
    detectConfigChanges();

    // Observe changes in the config
    vscode.workspace.onDidChangeConfiguration(detectConfigChanges);
  } catch (error) {
    console.error(error);
  }
};

/** This method is called when the extension is deactivated */
export const deactivate = () => {};
