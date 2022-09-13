import { UtilsService } from '../services/utils.service';

declare const v3d: any;

export const setObjectsAoTexture = async (
  scene, 
  app,
  appData,
  menuLogicObject,
  apiUrl
) => {
  ///
  const object3dEntities = UtilsService.findObject3dsByMaterialEntity(
    appData,
    menuLogicObject
  );

  for (const object3d of object3dEntities) {
    // in case we have several object names, splitted by ','
    const object3dSceneNames = object3d.sceneName.split(',').map(n => n.trim());

    for (const sn of object3dSceneNames) {
      const object3d = UtilsService.getObjectByName(scene, sn);
      if (object3d && object3d.material) {
        const material = object3d.material;

        const textureKey = Object.keys(material.nodeTextures).find(key =>
          /^.*AO_Body.*$/gi.test(material.nodeTextures[key].name)
        );

        // find AO_Body.jpg
        let textureUrl = '';
        scene.traverse(c => {
          if (
            c &&
            c.userData.entity &&
            c.userData.entity.asset &&
            c.userData.entity.asset.assetUrls &&
            c.userData.entity.asset.assetUrls.length
          ) {
            const foundTextureUrl = c.userData.entity.asset.assetUrls.find(au =>
              /AO(_Metal)?_Body\.jpg$/gi.test(au)
            );
            if (foundTextureUrl) {
              textureUrl = foundTextureUrl;
            }
          }
        });

        if (!textureKey) {
          console.warn(`setObjectsAoTexture object3d ${sn} textureKey undefined`);
        }

        if (textureUrl) {
          const loader = new v3d.ImageLoader();
          loader.setCrossOrigin('Anonymous');
          const load = new Promise((resolve, reject) => {
            loader.load(`${apiUrl}${textureUrl}`, res => resolve(res));
          });
          const image = await load;
          const texture = material.nodeTextures[textureKey];
          texture.image = image;
          texture.format = 1023;
          texture.needsUpdate = true;
          texture.format = v3d.RGBFormat;
          texture.needsUpdate = true;
          UtilsService.updateWorldMaterialConcerningTexture(app, texture);
        } else {
          console.warn(`setObjectsAoTexture object3d ${sn} textureUrl not found`);
        }
      } else {
        console.warn(`setObjectsAoTexture object3d ${sn} not found or its material does not exist`);
      }
    }
  }
};
