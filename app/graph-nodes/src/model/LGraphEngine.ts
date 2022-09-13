import {LGraph} from "litegraph.js";

declare const LGraph;
declare const LGraphCanvas;
declare const LiteGraph;

export class LGraphEngine {
    private graph: any = new LGraph();
    private graph_canvas: any;
    private liteGraphClass: any = LiteGraph;

    initEngine(canvas: HTMLElement){
        let canvasElement = canvas;
        if (!canvas){
            console.info('Canvas not found, new canvas was created')
            canvasElement = this.createCanvas();
        }
        this.graph_canvas = new LGraphCanvas(canvasElement, this.graph);
        this.resize();
    }
    get lGraph(): object {
        return this.graph
    }
    get liteGraph(): object {
        return this.liteGraphClass
    }

    run(): void {
        this.graph.start();
    }

    startRender(): void {
        this.graph_canvas.startRendering();
    }


    stopRender(): void {
        this.graph_canvas.stopRendering();
    }

    resize(): void {
        this.graph_canvas.resize();
    }
    createCanvas(){
        const canvas = document.createElement("canvas");
        const root = document.querySelector('.bg');
        root.innerHTML = '';
        root.appendChild(canvas);
        return canvas;
    }
}