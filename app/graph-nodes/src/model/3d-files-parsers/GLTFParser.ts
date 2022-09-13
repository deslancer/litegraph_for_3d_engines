export class GLTFParser {
    constructor() {

    }

    parseGLTF(url) {
        return new Promise((resolve)=>{
            this.loadGLTFFile(url).then((data) => {

                let nodes, materials, textures;
                nodes = data.nodes;
                materials = data.materials;
                textures = data.textures;
                const hierarchy = {
                    'nodes': [],
                    'materials': materials,
                    'textures': []
                };


                nodes.forEach((node) => {
                    const parent_node = {
                        [node.name]: []
                    };

                    if (node.hasOwnProperty('children')) {
                        node.children.forEach((child) => {
                            parent_node[node.name].push(nodes.find((item) => item.mesh == child))
                        })
                        hierarchy.nodes.push(parent_node)
                    }
                })
                console.log(hierarchy)
                resolve(hierarchy);
            });
        })
    }

    private async loadGLTFFile(url) {
        try {
            const response = await fetch(
                url
            );
            const data = await response.json();

            if (response.ok) {
                return data;
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}