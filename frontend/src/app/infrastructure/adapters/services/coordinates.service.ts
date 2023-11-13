import {Injectable} from '@angular/core';
import {Point} from "../../../core/domain/entities/point";
import {Quadrilateral} from "../../../core/domain/entities/quadrilateral";
import {Rectangle} from "../../../core/domain/entities/rectangle";

@Injectable({
  providedIn: 'root'
})
export class CoordinatesService {

  // System set up

  private offsetX: number = 0;
  private offsetY: number = 0;
  private weight: number = 1;

  public setupSystem(offsetX: number, offsetY: number, weight: number): void {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.weight = weight;
  }

  public setWeight(weight: number): void {
    this.weight = weight;
  }

  // Original to System conversion

  public originalToSystemX(x: number): number {
    return this.offsetX + x * this.weight;
  }

  public originalToSystemY(y: number): number {
    return this.offsetY + y * this.weight;
  }

  public originalToSystemPoint(point: Point): Point {
    return {
      x: this.originalToSystemX(point.x),
      y: this.originalToSystemY(point.y)
    }
  }

  public originalToSystemQuadrilateral(quadrilateral: Quadrilateral): Quadrilateral {
    return {
      p1: this.originalToSystemPoint(quadrilateral.p1),
      p2: this.originalToSystemPoint(quadrilateral.p2),
      p3: this.originalToSystemPoint(quadrilateral.p3),
      p4: this.originalToSystemPoint(quadrilateral.p4),
    }
  }

  public originalToSystemRectangle(rectangle: Rectangle): Rectangle {
    return {
      p1: this.originalToSystemPoint(rectangle.p1),
      p2: this.originalToSystemPoint(rectangle.p2)
    }
  }

  // System to Original conversion

  public systemToOriginalX(x: number): number {
    return this.weight ? Math.round(x / this.weight) : 0;
  }

  public systemToOriginalY(y: number): number {
    return this.weight ? Math.round(y / this.weight) : 0;
  }

  public systemToOriginalPoint(point: Point): Point {
    return {
      x: this.systemToOriginalX(point.x),
      y: this.systemToOriginalY(point.y)
    }
  }

  public systemToOriginalQuadrilateral(quadrilateral: Quadrilateral): Quadrilateral {
    return {
      p1: this.systemToOriginalPoint(quadrilateral.p1),
      p2: this.systemToOriginalPoint(quadrilateral.p2),
      p3: this.systemToOriginalPoint(quadrilateral.p3),
      p4: this.systemToOriginalPoint(quadrilateral.p4),
    }
  }

  public systemToOriginalRectangle(rectangle: Rectangle): Rectangle {
    return {
      p1: this.systemToOriginalPoint(rectangle.p1),
      p2: this.systemToOriginalPoint(rectangle.p2)
    }
  }
}
