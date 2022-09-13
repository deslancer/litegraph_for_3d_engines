import { Action } from '../model/action';

export const actions: Action[] = [
  {
    id: '8e859f9e-75a8-4f26-8554-487b9b28ee7d',
    title: 'Set car wheels [Any]',
    arguments: [],
    depricated: false
  },
  {
    id: 'f2ee152b-59ba-46cf-a5c4-b1cefb8c1b53',
    title: 'Set material [Any]',
    arguments: [
      {
        name: 'object3d',
        label: 'Object3d',
        controlType: 'autocompleteObject3d'
      },
      {
        name: 'material',
        label: 'Material',
        controlType: 'autocompleteMaterial'
      }
    ],
    depricated: false
  },
  {
    id: '5eab422e-448e-40f7-9bd2-917d8fb897b4',
    title: 'Set objects menu material [Any]',
    depricated: false
  },
  {
    id: '118cdd5d-13e7-472a-aeb4-43f74b72ee16',
    title: 'Change test object [Any]',
    depricated: false,
    arguments: []
  },
  {
    id: 'abc9be47-8a21-4a24-b2fc-569dfd8d5d26',
    title: 'Change car [Any]',
    depricated: false
  },
  {
    id: 'cffb8e04-66d9-4e32-bb87-97c9526488d0',
    title: 'Set metal body ao texture [Verge3d]',
    depricated: false
  },
  {
    id: '64c79c30-111a-4b73-af82-e78d2d3bde48',
    title: 'Change armrest (ues) [Any]',
    depricated: false
  },
  {
    id: '4889f97f-6fae-43d0-a695-ab02c7b66675',
    title: 'Set objects ao texture [Verge3d]',
    depricated: false
  },
  {
    id: '33204c40-2060-43f0-9632-ecc3f902e238',
    title: 'Switch show hide objects [Any]',
    depricated: false,
    arguments: [
      {
        name: 'hiddenObjects',
        label: 'Hide Objects',
        controlType: 'dynamicArray',
        dynamicField: {
          label: 'To Hide Objects',
          controlType: 'autocompleteObject3d'
        },
        fields: []
      },
      {
        name: 'shownObjects',
        label: 'Show Objects',
        controlType: 'dynamicArray',
        dynamicField: {
          label: 'To Show Objects',
          controlType: 'autocompleteObject3d'
        },
        fields: []
      }
    ]
  },
  {
    id: 'ce0f56a6-f1f5-4789-bd7c-1a03b013e417',
    title: 'Show hide objects [Any]',
    depricated: false,
    arguments: [
      {
        name: 'hiddenObjects',
        label: 'Hide Objects',
        controlType: 'dynamicArray',
        dynamicField: {
          label: 'To Hide Objects',
          controlType: 'autocompleteObject3d'
        },
        fields: []
      },
      {
        name: 'shownObjects',
        label: 'Show Objects',
        controlType: 'dynamicArray',
        dynamicField: {
          label: 'To Show Objects',
          controlType: 'autocompleteObject3d'
        },
        fields: []
      }
    ]
  },
  {
    id: '8a36e3ff-763d-4220-ad4d-700e10f3e972',
    title: 'Toggle objects visibility [Any]',
    depricated: false
  },
  {
    id: '4745d7f2-4908-47ec-a648-7572cce652e8',
    title: 'Set material colors [Verge3d]',
    depricated: false
  },
  {
    id: '454590e8-5ae7-483d-9bfe-e0c33a660cd6',
    title: 'Set material values [Verge3d]',
    depricated: false
  },
  {
    id: '914b21e4-7c4a-465b-8ac1-70b7556382b2',
    title: 'Set material texture [Verge3d]',
    depricated: false
  },
  {
    id: '9aad4232-e39c-48c7-876d-45d5293cb54d',
    title: 'Toggle material [Any]',
    depricated: false
  },
  {
    id: '94351714-b5d8-4651-bedf-e087873eda1a',
    title: 'Hide objects [Any]',
    depricated: false
  },
  {
    id: 'fa9e0841-9cda-4f5c-988b-86e9684892b1',
    title: 'Toggle Window And Mezzanine [Garage App]',
    depricated: false
  },
  {
    id: '3530e770-908d-422c-8981-cd03204a1037',
    title: 'Shift Walls [Garage App]',
    depricated: false
  },
  {
    id: 'ca0774f1-a6f9-4902-86ac-badbd8ee2442',
    title: 'Switch Objects',
    depricated: false
  },
  {
    id: 'd0295c08-de97-4a5c-b7fd-f513e0a72604',
    title: 'Load asset',
    depricated: false,
    arguments: []
  },
  {
    id: 'djeo349j-p3k5-h1h8-3l6m-de9fg8u76l29',
    title: 'Load new scene by object',
    depricated: false,
    arguments: [
      {
        name: 'object3d',
        label: 'Object3d',
        controlType: 'autocompleteObject3d'
      }
    ]
  },
  {
    id: '1s95d7f2-4158-4s0c-4k48-757d1ce65j4a',
    title: 'Set material colors test',
    depricated: false,
    arguments: [
      {
        name: 'object3d',
        label: 'Object3d',
        controlType: 'autocompleteObject3d'
      },
      {
        name: 'material_color',
        label: 'material_color',
        controlType: 'autocompleteMaterial'
      }
    ]
  },
  {
    id: 'h29l47f2-dh4k-ah65-49wj-l3o11cp3kj02',
    title: 'Change windows',
    depricated: false,
    arguments: [
      {
        name: 'object3d',
        label: 'Object3d',
        controlType: 'autocompleteObject3d'
      },
      {
        name: 'material',
        label: 'material',
        controlType: 'autocompleteMaterial'
      }
    ]
  },
  {
    id: 'hd7e9kw-l3os-p94i-q9el-ldo98e7fo3k6',
    title: 'Choose item with zoom',
    depricated: false,
    arguments: [
      {
        name: 'object3d',
        label: 'Object3d',
        controlType: 'autocompleteObject3d'
      }
    ]
  }
]
