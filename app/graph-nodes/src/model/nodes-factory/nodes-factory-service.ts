import * as Logic3DActions from "../logic/actions/index";
import {LGraphEngine} from "../LGraphEngine";

export class NodesFactoryService {
    private LGraphEngine: LGraphEngine = new LGraphEngine();
    private readonly lGraphClass;

    constructor() {
        this.lGraphClass = this.LGraphEngine.liteGraph
        this.nodesFromFunc();
    }

    /**
     * Get all actions name from logic3d,then get functions by these names
     * and convert into LGraph Nodes
     */
    nodesFromFunc(): void {
        const actionsArray = this.getAllActions(Logic3DActions);
        for (let i = 0; i < actionsArray.length; i++) {
            const methodName = actionsArray[i];
            const actionMethod = Logic3DActions[methodName];

            try {
                this.lGraphClass.wrapFunctionAsNode("custom/" + methodName, actionMethod, null, null, null);

            } catch (e) {
                console.group("Error with - " + methodName)
                console.log(e)
                console.error("Error in method - " + methodName)
                console.groupEnd()
            }
        }

    }

    private getAllActions(obj): Array<string> {
        let properties = new Set()
        let currentObj = obj
        do {
            Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
        } while ((currentObj = Object.getPrototypeOf(currentObj)))
        return [...properties.keys()].filter(item => typeof obj[item] === 'function')
    }

}
