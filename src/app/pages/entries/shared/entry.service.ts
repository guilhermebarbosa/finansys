import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { Entry } from './entry.model';

import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceService } from '../../../shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(
    protected injector: Injector,
    protected categoryService: CategoryService,
  ) {
    super('api/entries', injector, Entry.fromJson);
   }

  create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSend(entry, super.create.bind(this))
  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSend(entry, super.update.bind(this));
  }


  private setCategoryAndSend(entry: Entry, sendFn: any): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      switchMap(category => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handleError.bind(this))
    );
  }

}
