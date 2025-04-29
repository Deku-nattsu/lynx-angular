import { workspaces } from "@angular-devkit/core";
import { NodeJsSyncHost } from "@angular-devkit/core/node";
import path from "path";

const DEFAULT_WORKSPACE_PATH = "/angular.json";

export async function getWorkspace(): Promise<workspaces.WorkspaceDefinition> {
  const relativeWorkspacePath = path.join(
    process.cwd(),
    DEFAULT_WORKSPACE_PATH
  );
  const host = workspaces.createWorkspaceHost(new NodeJsSyncHost());
  const { workspace } = await workspaces.readWorkspace(
    relativeWorkspacePath,
    host
  );
  return workspace;
}






