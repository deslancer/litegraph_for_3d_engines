import { ExecuteActionArguments } from '../model/execute-action-arguments';

declare const v3d: any;


export const chooseItemWithZoom = async (args: ExecuteActionArguments) => {
  const { actionArguments, apiUrl, app, logic, scene } = args;

    if (!actionArguments || !scene) {
      console.warn(`Action: [chooseItem] actionArguments or scene is absent`);
      return;
    }

    let { object3d } = actionArguments;
    if (!object3d) {
      console.warn(`Action: [chooseItem] object is absent`);
      return;
    }

    const objectEntity = logic.object3ds.find(o => o.id === object3d);

    if (!objectEntity) {
      console.warn(`Action: [chooseItem] object with id ${object3d} is not attached to logic`);
      return;
    }

  let cameraObjectSceneName = 'Camera_Main';

    if (objectEntity.sceneName.includes('Windows')){
        cameraObjectSceneName = `Camera_Windows_0${objectEntity.sceneName.substring(objectEntity.sceneName.length - 2)}`;
    } else if (objectEntity.sceneName.includes('Entry_Door')) {
        cameraObjectSceneName = 'Camera_Entry_Door';
    } else if (objectEntity.sceneName.includes('Patio_Door')) {
        cameraObjectSceneName = 'Camera_Patio_Door';
    } else if (objectEntity.sceneName.includes('Siding')) {
        cameraObjectSceneName = 'Camera_Siding';
    }

    // camera object by object entity scene name
    let newCamera = scene.getObjectByName(cameraObjectSceneName)


    function animate() {
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate)
    //
};

