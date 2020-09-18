import { OnInit } from '@angular/core';

import { BaseResourceModel } from '../../../shared/models/base-resource.model';
import { BaseResourceService } from '../../../shared/services/base-resource.service';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(protected resourceService: BaseResourceService<T>) { }

  ngOnInit(): void {
    this.resourceService.getAll().subscribe(
      resources => this.resources = resources.sort((a,b) => b.id - a.id),
      error => alert('Erro ao carregar a lista')
    );
  }

  deleteResource(resource: T, msg: string = 'Deseja realmente excluir este item?') {
    const mustDelete = confirm(msg);

    if(mustDelete){
      this.resourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(element => element != resource),
        () => alert('Erro ao tentar excluir')
      )
    }
  }

}
