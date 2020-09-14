import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from './pages/categories/shared/category.model';


export class InMemoryDatabase implements InMemoryDbService {

  createDb(){
    const categories: Category[] = [
      { id: 1, name: 'Lazer', description: 'lugar para lazer' },
      { id: 2, name: 'Cinema', description: 'lugar para assistir um filme' },
      { id: 3, name: 'Clube', description: 'lugar para jogar tenis!' },
      { id: 4, name: 'Parque', description: 'lugar para passear' },
      { id: 5, name: 'Casa', description: 'lugar para relaxar' }
    ]

    return { categories };
  }
}
