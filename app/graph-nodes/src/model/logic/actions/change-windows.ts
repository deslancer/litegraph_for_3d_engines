import { ActionFn } from '../model/action-fn';
import { ExecuteActionArguments } from '../model/execute-action-arguments';
import { UtilsService } from '../services/utils.service';


export const changeWindows: ActionFn = async (args: ExecuteActionArguments) => {
  const { actionArguments, apiUrl, app, logic, scene } = args;
  if (!actionArguments || !scene) {
    console.warn(`Action: [changeWindows] actionArguments or scene is absent`);
    return;
  }
  let { object3d, material } = actionArguments;
  if (!object3d) {
    console.warn(`Action: [changeWindows] object or material is absent`);
    return;
  }

  const objectToChangeEntity = logic.object3ds.find(o => o.id === object3d);
  const materialEntity = logic.materials.find(o => o.id === material);

  if (!objectToChangeEntity) {
    console.warn(`Action: [changeWindows] object with id ${object3d} is not attached to logic`);
    return;
  }

  if (!materialEntity) {
    console.warn(`Action: [changeWindows] material with id ${material} is not attached to logic`);
    return;
  }

  if (!(materialEntity.data && materialEntity.data.properties && materialEntity.data.properties.length)) {
    console.warn(`Action: [changeWindows] material properties is absent`);
    return;
  }

  let materialProperties = materialEntity.data.properties

  let object3ds = []
  let sceneNameRegexp = new RegExp(`^${objectToChangeEntity.sceneName}.*`, 'gi')
  scene.traverse(sc => {
    if (sc.name === objectToChangeEntity.sceneName) {
    // if (sc.name.includes(objectToChangeEntity.sceneName) || sceneNameRegexp.test(sc.name)) {
      object3ds = [...object3ds, sc]
    }
  })

  if (!object3ds.length) {
    console.warn(`[changeWindows] material ${objectToChangeEntity.sceneName} no object3ds found`);
    return;
  }

  const url = UtilsService.getMainAsset(logic.asset.assetUrls);
  const loadedScene = await(<any>UtilsService.loadScene(app, `${apiUrl}${url}`));
  let loadedSceneCopy = loadedScene.clone()
  loadedSceneCopy.name = objectToChangeEntity.sceneName

  object3ds.forEach(obj3d => {
    let parent = obj3d.parent

    // // set object position
    loadedSceneCopy.position.x = obj3d.position.x
    loadedSceneCopy.position.y = obj3d.position.y
    loadedSceneCopy.position.z = obj3d.position.z
    parent.remove(obj3d);
    parent.add(loadedSceneCopy);
  })
};
