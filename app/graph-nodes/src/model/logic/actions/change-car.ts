import { setCarWheels } from './set-car-wheels';
import { UtilsService } from '../services/utils.service';

export async function changeCar (scene, app, logic, menuLogicObject, apiUrl) {
  const wheelObjects = scene.getObjectByName('Wheel_Objects');
  let currentObjectInScene;

  for (let i = 0; i < logic.data.objects.length; i++) {
    if (!currentObjectInScene) {
      currentObjectInScene = UtilsService.getObjectByName(
        scene,
        logic.data.objects[i].sceneName
      );
    } else {
      break;
    }
  }

  if (currentObjectInScene.name === menuLogicObject.sceneName) return;

  const objectToChange = await (<any>(
    UtilsService.getObjectByEntity(scene, app, menuLogicObject, apiUrl)
  ));

  const allObject = UtilsService.getObjectBySceneNameInEntity(
    scene,
    currentObjectInScene.name
  );

  const parent = allObject.parent;
  parent.remove(allObject);
  parent.add(objectToChange);

  scene.add(wheelObjects);
  setCarWheels(app);
};
