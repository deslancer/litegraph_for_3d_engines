import { ActionFn } from '../model/action-fn';
import { ExecuteActionArguments } from '../model/execute-action-arguments';
import { UtilsService } from '../services/utils.service';

export const loadAsset: ActionFn = async (args: ExecuteActionArguments) => {
  const { app, apiUrl, logic, scene } = args;
  if (logic.asset) {
    const url = UtilsService.getMainAsset(logic.asset.assetUrls);
    const loadedScene = await (<any>UtilsService.loadScene(app, `${apiUrl}${url}`));
    scene.add(loadedScene);
  }
};
