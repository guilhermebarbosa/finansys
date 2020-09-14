import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  // tslint:disable-next-line: typedef
  submitForm() {
    this.submittingForm = true;

    if(this.currentAction == 'new') {
      this.createCategory();
    }
    else {
      this.updateCategory();
    }
  }

  // PRIVATE METHODS
  // tslint:disable-next-line: typedef
  private setCurrentAction() {
    if(this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    }
    else {
      this.currentAction = 'edit';
    }
  }

  // tslint:disable-next-line: typedef
  private buildCategoryForm(){
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  // tslint:disable-next-line: typedef
  private loadCategory(){
    if(this.currentAction == 'edit'){

      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      ).subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category); // bind values to form
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
      );

    }
  }

  // tslint:disable-next-line: typedef
  private setPageTitle(){
    if(this.currentAction == 'new') {
      this.pageTitle = 'Criando uma nova categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando categoria ' + categoryName;
    }
  }

  // tslint:disable-next-line: typedef
  private createCategory(){
    const category:Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category)
    .subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      (category) => this.actionsForSuccess(category),
      (error) => this.actionsForError(error)
    );
  }

  // tslint:disable-next-line: typedef
  private updateCategory(){
    const category:Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category)
    .subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      (category) => this.actionsForSuccess(category),
      (error) => this.actionsForError(error)
    );
  }

  // tslint:disable-next-line: typedef
  private actionsForSuccess(category: Category){
    toastr.success('A sua solicitação foi efetuada com sucesso!');

    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(["categories", category.id, 'edit'])
    )
  }

  // tslint:disable-next-line: typedef
  private actionsForError(error){
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if(error.status === 422){
      this.serverErrorMessages = JSON.parse(error.messages).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }

}
