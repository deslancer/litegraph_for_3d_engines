import { UtilsService } from '../services/utils.service';

export const changeTestObject = async (
  scene, 
  app,
  appData,
  logic,
  menuLogicObject,
  apiUrl
) => {
  const objectToChange = await (<any>(
    UtilsService.getObjectByEntity(scene, app, menuLogicObject, apiUrl)
  ));
  const defaultObjectEntity = logic.data.objects.find((o) => o.defaultObject);
  const holderGroupObjectEntity = UtilsService.findParentObjectByObject3dEntity(
    appData,
    menuLogicObject
  );
  const defaultObject = UtilsService.getObjectByName(
    scene,
    defaultObjectEntity.sceneName
  );
  const holderGroupObject = UtilsService.getObjectByName(
    scene,
    holderGroupObjectEntity.sceneName
  );
  if (!objectToChange || !defaultObject || !holderGroupObject) {
    console.warn(
      `Some of the objects with the scene names ${menuLogicObject.sceneName}, ${defaultObjectEntity.sceneName}, ${holderGroupObjectEntity.sceneName} are not found`
    );
    return;
  }

  const material = holderGroupObject.children.length
    ? holderGroupObject.children[0].material.clone()
    : defaultObject.material.clone();

  holderGroupObject.remove(...holderGroupObject.children);
  if (menuLogicObject.defaultObject) {
    objectToChange.visible = true;
  } else {
    defaultObject.visible = false;
    holderGroupObject.add(objectToChange);
  }

  objectToChange.material = material;
};
