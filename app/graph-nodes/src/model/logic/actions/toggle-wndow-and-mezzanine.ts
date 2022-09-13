import { UtilsService } from '../services/utils.service'

export const toggleWindowAndMezzanine = async scene => {
  const windowAndMezzanineGroupName = 'Window_and_Mezzanine_grp'
  const interiorWallLinersNOWindowsName = 'Interior_Wall_Liners_NOWindows'

  const windowAndMezzanineGroup = UtilsService.getObjectByName(
    scene,
    windowAndMezzanineGroupName
  )
  const interiorWallLinersNOWindows = UtilsService.getObjectByName(
    scene,
    interiorWallLinersNOWindowsName
  )

  if (!windowAndMezzanineGroup) {
    console.warn(`${windowAndMezzanineGroupName} not found`)
    return
  }

  if (!interiorWallLinersNOWindows) {
    console.warn(`${interiorWallLinersNOWindowsName} not found`)
    return
  }

  if (windowAndMezzanineGroup.visible) {
    windowAndMezzanineGroup.visible = false
    interiorWallLinersNOWindows.visible = true
  } else {
    windowAndMezzanineGroup.visible = true
    interiorWallLinersNOWindows.visible = false
  }
}
