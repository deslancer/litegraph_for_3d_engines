<script lang="ts">
    import {LGraphEngine} from "./model/LGraphEngine";
    import {GLTFParser} from "./model/3d-files-parsers/GLTFParser";
    import {onMount} from "svelte";
    import {OBJParser} from "./model/3d-files-parsers/OBJParser";
    import {JSONParser} from "./model/3d-files-parsers/JSONParser";
    import {NodesFactoryService} from "./model/nodes-factory/nodes-factory-service";

    let element;
    onMount(() => {
        const lGraphEngine = new LGraphEngine();
        lGraphEngine.initEngine();
        const GLTFparser = new GLTFParser();
        const OBJparser = new OBJParser();
        const json_parser = new JSONParser();
        const nodeFactory = new NodesFactoryService();
        const scene_hierarchy = GLTFparser.parseGLTF('assets/models/shelter.gltf');

    })

</script>
<div class="bg">
    <canvas bind:this={element}></canvas>
</div>


<style>
    canvas {
        width: 100%;
        height: 100%;
    }

    .bg {
        display: block;
        width: 100%;
        height: 100%;
        background-color: #3a3a3a;
    }
</style>