import { ActionFn } from '../model/action-fn';
import { ExecuteActionArguments } from '../model/execute-action-arguments';
import { UtilsService } from '../services/utils.service';

export const loadNewSceneByObject: ActionFn = async (args: ExecuteActionArguments) => {
  const { actionArguments, apiUrl, app, logic, scene } = args;
  if (!actionArguments || !scene) {
    console.warn(`Action: [loadNewSceneByObject] actionArguments or scene is absent`);
    return;
  }
  let { object3d } = actionArguments;
  if (!object3d) {
    console.warn(`Action: [loadNewSceneByObject] object is absent`);
    return;
  }

  const objectToChangeEntity = logic.object3ds.find(o => o.id === object3d);

  if (!objectToChangeEntity) {
    console.warn(`Action: [loadNewSceneByObject] object with id ${object3d} is not attached to logic`);
    return;
  }

  let currentObject: any = scene.getObjectByName(objectToChangeEntity.sceneName);

  if (!currentObject) {
    const url = UtilsService.getMainAsset(logic.asset.assetUrls);
    const loadedScene = await (<any>UtilsService.loadScene(app, `${apiUrl}${url}`));
    if (scene.children.length) {
      await scene.children.slice().forEach(child => scene.remove(child))
    }
    await scene.add(loadedScene)
    return await Promise.resolve()
  }
};
