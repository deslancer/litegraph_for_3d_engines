
/* Works only with THREEJS scenes*/

export class JSONParser {
    parseJSON(url){
        return new Promise((resolve)=>{
            this.loadJSONFile(url).then((data) => {

                let nodes, materials;
                nodes = data.object.children;
                materials = data.materials;
                const hierarchy = {
                    'nodes': [],
                    'materials': materials,
                    'lights': []
                };

                nodes.forEach((node) => {
                   const parent_node = {
                        [node.name]: []
                    };
                    if(node.type == 'Group') {
                        node.children.forEach((child) => {
                            parent_node[node.name].push(child)
                        })
                        hierarchy.nodes.push(parent_node)
                    }else if( node.type.includes('Light')){
                        hierarchy.lights.push(node);
                    }
                })
                console.log(hierarchy)
                resolve(hierarchy);
            });
        })
    }
    private async loadJSONFile(url){
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                return data;
            }
        } catch (error) {
            console.log(error);
            return '';
        }
    }
}