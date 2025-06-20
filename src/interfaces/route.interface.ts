import { Router } from "express";

export type ControllerConstructor = new (...args: any[]) => any;
export type RouterConstructor = new (controller: any) => { router: Router };
export type DependencyConstructor = new (...args: any[]) => any;

export interface IRoute {
  path: string;
  router: RouterConstructor;
  controller: ControllerConstructor;
  dependencies?: DependencyConstructor[]; // Array de constructores de dependencias
}
