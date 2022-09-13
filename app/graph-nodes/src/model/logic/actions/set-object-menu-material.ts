import { UtilsService } from '../services/utils.service';

export const setObjectMenuMaterial = async (scene, app, appData, menuLogicObject, apiUrl) => {
  try {
    const material = await UtilsService.getMaterialByEntity(scene, app, menuLogicObject, apiUrl);
    if (!material) {
      // error
      console.warn(`Object with a scene name ${menuLogicObject.sceneName} cannot be found in the scene and cannot be loaded`);
      return;
    }
    const object3ds = UtilsService.findObject3dsByMaterialEntity(appData, menuLogicObject);

    if (!object3ds.length) {
      console.warn(`setObjectMenuMaterial material ${menuLogicObject.sceneName} no object3ds found`);
      return;
    }

    UtilsService.changeMaterialOnObject3dEntities(scene, object3ds, material);
  } catch (err) {
    console.error(`setObjectMenuMaterial error`, err);
  }
};
