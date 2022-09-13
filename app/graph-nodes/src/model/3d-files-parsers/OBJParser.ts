export class OBJParser {

    parseOBJ(url){
        return new Promise((resolve)=>{
            this.loadOBJFile(url).then((data) => {
                let objText = data.trim() + "\n";
                let objLineArray = objText.split("\n");
                const hierarchy = {
                    'nodes': [],
                };

                for (let indexLine = 0; indexLine < objLineArray.length; indexLine++) {

                    let line = objLineArray[indexLine];
                    line = line.trim().replace(/\s+/g, ' ');

                    let lineData = line.split(" ");
                    const typeVertexData = lineData[0];
                    if (typeVertexData === "o") {
                        hierarchy.nodes.push({
                            'name': lineData[1]
                        })
                    }else if (typeVertexData === "g"){
                        console.log(lineData)
                    }
                }
                //console.log(hierarchy)
                resolve(hierarchy);
            });
        })
    }
   private async loadOBJFile(url): Promise<string>{
        try {
            const response = await fetch(
                url
            );
            const data = await response.text();

            if (response.ok) {
                return data;
            }
        } catch (error) {
            console.log(error);
            return '';
        }
    }
}