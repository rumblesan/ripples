
declare class AppObj {
    renderer: any;
    scene: any;
    camera: any;
    render(): void;
}

declare module App {

    declare function create(width: number, height: number): AppObj;

}


