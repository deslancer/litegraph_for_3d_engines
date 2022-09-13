import { ExecuteActionArguments } from '../model/execute-action-arguments';
import { UtilsService } from '../services/utils.service';

export const setMaterial = async (args: ExecuteActionArguments) => {
  const { actionArguments, apiUrl, app, logic, scene } = args;
  if (!actionArguments || !scene) {
    console.warn(`Action: [showHideObjects] actionArguments or scene is absent`);
    return;
  }
  let { object3d, material } = actionArguments;
  if (!object3d || !material) {
    console.warn(`Action: [setMaterial] object or material is absent`);
    return;
  }

  const objectEntity = logic.object3ds.find(o => o.id === object3d);

  if (!objectEntity) {
    console.warn(`Action: [setMaterial] object with id ${object3d} is not attached to logic`);
    return;
  }
  
  object3d = await UtilsService.getObjectByEntity(scene, app, objectEntity, apiUrl);

  const materialEntity = logic.materials.find(o => o.id === material);

  if (!materialEntity) {
    console.warn(`Action: [setMaterial] material with id ${material} is not attached to logic`);
    return;
  }

  material = await UtilsService.getMaterialByEntity(scene, app, materialEntity, apiUrl);

  if (object3d && material) object3d.material = material;
};
