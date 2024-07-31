declare module 'roughjs/bundled/rough.cjs.js' {
    import { RoughCanvas } from 'roughjs/bin/canvas';
    import { RoughGenerator } from 'roughjs/bin/generator';
    
    export function canvas(canvas: HTMLCanvasElement, config?: any): RoughCanvas;
    export function generator(config?: any): RoughGenerator;
  }
  