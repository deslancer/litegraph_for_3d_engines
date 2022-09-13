
import {
  changeWindows, chooseItemWithZoom,
  loadAsset,
  loadNewSceneByObject,
  setMaterial,
  setMaterialColorsTest,
  showHideObjects,
  switchShowHideObjects
} from '../actions';
import { actions } from '../configs/actions';
import { ExecuteActionArguments } from '../model/execute-action-arguments';

export const ActionService = {
  async executAction (args: ExecuteActionArguments) {
    const { actionId } = args;
    try {
      switch (actionId) {
        case 'd0295c08-de97-4a5c-b7fd-f513e0a72604': {
          // Load Asset
          loadAsset(args);
          break;
        }
        case 'ce0f56a6-f1f5-4789-bd7c-1a03b013e417': {
          // Show hide objects
          showHideObjects(args);
          break;
        }
        case '33204c40-2060-43f0-9632-ecc3f902e238': {
          // Switch show hide objects
          switchShowHideObjects(args);
          break;
        }
        case 'f2ee152b-59ba-46cf-a5c4-b1cefb8c1b53': {
          // Set material
          setMaterial(args);
          break;
        }
        case 'djeo349j-p3k5-h1h8-3l6m-de9fg8u76l29': {
          // Load new scene by object
          await loadNewSceneByObject(args);
          break;
        }
        case '1s95d7f2-4158-4s0c-4k48-757d1ce65j4a': {
          // Set material colors
          await setMaterialColorsTest(args);
          break;
        }
        case 'h29l47f2-dh4k-ah65-49wj-l3o11cp3kj02': {
          // Change windows material
          await changeWindows(args);
          break;
        }
        case 'hd7e9kw-l3os-p94i-q9el-ldo98e7fo3k6': {
          // Change windows material
          await chooseItemWithZoom(args);
          break;
        }
      }
    } catch (err) {
      const executedAction = actions.find(a => a.id === actionId);
      const title = executedAction ? executedAction.title : 'n/d';
      console.error(`Error: executAction with id ${actionId} and title ${title} error`, err);
    }
  }
};

// export const ActionService = {
//   // scene, app, appData, logic, action, menuLogicObject, apiUrl
//   async executAction(scene, app, appData, logic, action, menuLogicObject?, apiUrl?: string) {
//     try {
//       switch (action) {
//         case '8e859f9e-75a8-4f26-8554-487b9b28ee7d': {
//           // Set car wheels
//           setCarWheels(scene);
//           break;
//         }
//         case 'f2ee152b-59ba-46cf-a5c4-b1cefb8c1b53': {
//           // Set material
//           setMaterial(scene, logic);
//           break;
//         }
//         case '5eab422e-448e-40f7-9bd2-917d8fb897b4': {
//           // Set objects menu material
//           await setObjectMenuMaterial(scene, app, appData, menuLogicObject, apiUrl);
//           break;
//         }
//         case '118cdd5d-13e7-472a-aeb4-43f74b72ee16': {
//           // Change test object
//           await changeTestObject(scene, app, appData, logic, menuLogicObject, apiUrl);
//           break;
//         }
//         case 'abc9be47-8a21-4a24-b2fc-569dfd8d5d26': {
//           // Change object
//           await changeCar(scene, app, logic, menuLogicObject, apiUrl);
//           break;
//         }
//         case 'cffb8e04-66d9-4e32-bb87-97c9526488d0': {
//           // Set AO_Body.jpg metal body texture
//           await setMetalBodyAoTexture(scene, app, apiUrl);
//           break;
//         }
//         case '64c79c30-111a-4b73-af82-e78d2d3bde48': {
//           // Change armrest (ues)
//           await changeArmrest(scene, app, logic, menuLogicObject, apiUrl);
//           break;
//         }
//         case '4889f97f-6fae-43d0-a695-ab02c7b66675': {
//           // Change ao texture
//           await setObjectsAoTexture(scene, app, appData, menuLogicObject, apiUrl);
//           break;
//         }
//         case 'ce0f56a6-f1f5-4789-bd7c-1a03b013e417': {
//           // Show hide objects
//           showHideObjects(scene, app, menuLogicObject);
//           break;
//         }
//         case '8a36e3ff-763d-4220-ad4d-700e10f3e972': {
//           // Toggle objects visibility
//           await toggleObjectsVisibility(scene, app, menuLogicObject, apiUrl);
//           break;
//         }
//         case '4745d7f2-4908-47ec-a648-7572cce652e8': {
//           // Set material colors
//           setMaterialColors(scene, app, appData, menuLogicObject, apiUrl);
//           break;
//         }
//         case '454590e8-5ae7-483d-9bfe-e0c33a660cd6': {
//           // Set material values
//           setMaterialValues(scene, app, appData, menuLogicObject, apiUrl);
//           break;
//         }
//         case '914b21e4-7c4a-465b-8ac1-70b7556382b2': {
//           // Set node material texture
//           setNodeMaterialTexture(scene, app, appData, menuLogicObject, apiUrl);
//           break;
//         }
//         case '9aad4232-e39c-48c7-876d-45d5293cb54d': {
//           toggleMaterial(scene, app, appData, menuLogicObject, apiUrl);
//           break;
//         }
//         case '94351714-b5d8-4651-bedf-e087873eda1a': {
//           hideObjects(scene, logic);
//           break;
//         }
//         case 'fa9e0841-9cda-4f5c-988b-86e9684892b1': {
//           toggleWindowAndMezzanine(scene);
//           break;
//         }
//         case '3530e770-908d-422c-8981-cd03204a1037': {
//           shiftWalls(scene);
//           break;
//         }
//         case 'ca0774f1-a6f9-4902-86ac-badbd8ee2442': {
//           // Switch objects
//           const result = await switchObjects(scene, app, menuLogicObject, apiUrl);
//           return result;
//         }
//       }
//     } catch (err) {
//       const executedAction = actions.find(a => a.id === action);
//       const title = executedAction ? executedAction.title : 'n/d';
//       console.error(`executAction with id ${action} and title ${title} error`, err);
//     }
//   }
// };
