import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { BaseResourceModel } from '../models/base-resource.model';

export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient;

  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ) {
    this.http = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    return this.http.get(this.apiPath).pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError.bind(this))
    );
  }

  getById(id: number): Observable<T> {
    const url: string = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError.bind(this))
    );
  }

  create(category: T): Observable<T> {
    return this.http.post(this.apiPath, category).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError.bind(this))
    );
  }

  update(category: T): Observable<T> {
    const url:string = `${this.apiPath}/${category.id}`;
    return this.http.put(url, category).pipe(
      map(() => category),
      catchError(this.handleError.bind(this))
    );
  }

  delete(id: number): Observable<any> {
    const url:string = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      map(() => null),
      catchError(this.handleError)
    );
  }

  // PROTECTED METHODS

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => resources.push(this.jsonDataToResourceFn(element)));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData);
  }

  protected handleError(error: any): Observable<any[]> {
    console.log('ERRO DE REQUISIÇÃO => ', error);
    return throwError(error);
  }

}
