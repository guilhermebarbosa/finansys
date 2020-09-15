import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();

  constructor(
    private entryService: EntryService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  // tslint:disable-next-line: typedef
  submitForm() {
    this.submittingForm = true;

    if(this.currentAction == 'new') {
      this.createEntry();
    }
    else {
      this.updateEntry();
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
  private buildEntryForm(){
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [ Validators.required]],
      amount: [null, [ Validators.required]],
      date: [null, [ Validators.required]],
      paid: [null, [ Validators.required]],
      categoryId: [null, [ Validators.required]]
    });
  }

  // tslint:disable-next-line: typedef
  private loadEntry(){
    if(this.currentAction == 'edit'){

      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      ).subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry); // bind values to form
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
      );

    }
  }

  // tslint:disable-next-line: typedef
  private setPageTitle(){
    if(this.currentAction == 'new') {
      this.pageTitle = 'Criando uma novo Lançamento';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando Lançamento ' + entryName;
    }
  }

  // tslint:disable-next-line: typedef
  private createEntry(){
    const entry:Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.create(entry)
    .subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      (entry) => this.actionsForSuccess(entry),
      (error) => this.actionsForError(error)
    );
  }

  // tslint:disable-next-line: typedef
  private updateEntry(){
    const entry:Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry)
    .subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      (entry) => this.actionsForSuccess(entry),
      (error) => this.actionsForError(error)
    );
  }

  // tslint:disable-next-line: typedef
  private actionsForSuccess(entry: Entry){
    toastr.success('A sua solicitação foi efetuada com sucesso!');

    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(["entries", entry.id, 'edit'])
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
