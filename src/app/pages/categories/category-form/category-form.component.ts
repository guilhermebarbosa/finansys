import { Component, Injector } from '@angular/core';
import { Validators } from "@angular/forms";
import { BaseResourceFormComponent } from '../../../shared/components/base-resource-form.component';

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

  constructor(
    protected injector:Injector,
    protected categoryService:CategoryService
  ) {
    super(
      injector,
      new Category(),
      categoryService,
      Category.fromJson
    );
  }

  // tslint:disable-next-line: typedef
  protected buildResourceForm(){
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  protected creationPageTitle(): string {
    return 'Criando uma nova categoria';
  }

  protected editionPageTitle(): string {
    const resourceName = this.resource.name || '';

    return 'Editando categoria ' + resourceName;
  }

}
