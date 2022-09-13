import { UtilsService } from '../services/utils.service';
import { ExecuteActionArguments } from '../model/execute-action-arguments';

let on = false;

export const switchShowHideObjects = async (args: ExecuteActionArguments) => {
  const { actionArguments, apiUrl, app, logic, scene } = args;
  if (!actionArguments || !scene) {
    console.warn(`Action: [showHideObjects] actionArguments or scene is absent`);
    return;
  }
  const { hiddenObjects, shownObjects } = actionArguments;
  await UtilsService.changeObjectsVisibility(apiUrl, app, logic, shownObjects, scene, on ? false : true);
  await UtilsService.changeObjectsVisibility(apiUrl, app, logic, hiddenObjects, scene, on ? true : false);
  on = !on;
};
