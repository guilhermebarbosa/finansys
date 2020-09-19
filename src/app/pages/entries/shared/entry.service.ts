import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { Entry } from './entry.model';

import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceService } from '../../../shared/services/base-resource.service';

import * as moment from "moment";

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
  getByMonthAndYear(month: number, year: number): Observable<Entry[]> {
    return this.getAll().pipe(
      map(entries => this.filterByMonyhAndYear(entries, month, year))
    );
  }

  // PRIVATE METHODS

  private setCategoryAndSend(entry: Entry, sendFn: any): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      switchMap(category => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  private filterByMonyhAndYear(entries: Entry[], month: number, year: number) {
    return entries.filter(entry => {
      const entryDate = moment(entry.date, 'DD/MM/YYYY');
      const matchMonth = (entryDate.month() + 1 == month);
      const matchYear = (entryDate.year() == year);

      if(matchMonth && matchYear) return entry;
    })
  }

}
