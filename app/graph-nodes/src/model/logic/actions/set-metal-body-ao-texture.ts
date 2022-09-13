import { UtilsService } from '../services/utils.service';

declare const v3d: any;

export async function setMetalBodyAoTexture (scene, app, apiUrl) {
  let metalBody = UtilsService.getObjectByName(scene, 'Metal_Body');
  const material = metalBody.material;
  let textureKey = Object.keys(material.nodeTextures).find(key => /^.*AO_Body\..*$/gi.test(material.nodeTextures[key].name));

  if (!textureKey) {
    textureKey = Object.keys(material.nodeTextures).find(key => /^.*AO_Body.*$/gi.test(material.nodeTextures[key].name));
  }

  // find AO_Body.jpg
  let textureUrl = '';
  scene.traverse(c => {
    if (c && c.userData.entity && c.userData.entity.asset && c.userData.entity.asset.assetUrls && c.userData.entity.asset.assetUrls.length) {
      const url = c.userData.entity.asset.assetUrls.find(au => /AO(_Metal)?_Body\.jpg$/gi.test(au));
      if (url && UtilsService.getObjectByName(scene, 'Metal_Body')) {
        if (!textureUrl) {
          textureUrl = url;
        }
      }
    }
  });

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
  }
};
