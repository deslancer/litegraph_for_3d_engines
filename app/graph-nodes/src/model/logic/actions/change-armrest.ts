import { UtilsService } from '../services/utils.service';

export async function changeArmrest (scene, app, logic, menuLogicObject, apiUrl) {
  const mustBeVisibleEntities = menuLogicObject.sceneName
    .split(',')
    .map((sn) => ({ sceneName: sn.trim() }));

  const allObjectEntities = logic.data.objects.flatMap((o) => {
    return o.sceneName.split(',').map((sn) => ({ sceneName: sn.trim() }));
  });

  const mustBeInvisibleObjectEntities = allObjectEntities.filter((ao) => {
    return !mustBeVisibleEntities.find((mbv) => mbv.sceneName === ao.sceneName);
  });

  for (const mustBeVisibleEntity of mustBeVisibleEntities) {
    const object = await (<any>(
      UtilsService.getObjectByEntity(scene, app, mustBeVisibleEntity, apiUrl)
    ));
    if (object) {
      if (object) object.visible = true;
    }
  }

  for (const mustBeInvisibleObjectEntity of mustBeInvisibleObjectEntities) {
    const object = await (<any>(
      UtilsService.getObjectByEntity(scene, app, mustBeInvisibleObjectEntity, apiUrl)
    ));
    if (object) {
      if (object) object.visible = false;
    }
  }
};
