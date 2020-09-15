import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from './pages/categories/shared/category.model';
import { Entry } from './pages/entries/shared/entry.model';


export class InMemoryDatabase implements InMemoryDbService {

  createDb(){
    const categories: Category[] = [
      { id: 1, name: 'Lazer', description: 'lugar para lazer' },
      { id: 2, name: 'Cinema', description: 'lugar para assistir um filme' },
      { id: 3, name: 'Clube', description: 'lugar para jogar tenis!' },
      { id: 4, name: 'Parque', description: 'lugar para passear' },
      { id: 5, name: 'Casa', description: 'lugar para relaxar' }
    ];

    const entries: Entry[] = [
      { id: 1, name: 'Gás de Cozinha', description: 'conta de gas', categoryId: categories[0].id, category: categories[0], paid: true, date: '14/08/2020', amount: '70,00', type: 'expense' } as Entry,
      { id: 1, name: 'Ragnarok', categoryId: categories[1].id, category: categories[1], paid: true, date: '10/07/2020', amount: '5000,00', type: 'revenue' } as Entry,
      { id: 1, name: 'PC', description: 'atualização do PC', categoryId: categories[2].id, category: categories[2], paid: false, date: '13/09/2020', amount: '150,00', type: 'expense' } as Entry,
      { id: 1, name: 'Luz', description: 'conta de luz', categoryId: categories[3].id, category: categories[3], paid: true, date: '05/09/2020', amount: '1000,00', type: 'expense' } as Entry,
      { id: 1, name: 'Aluguel', description: 'conta de aluguel', categoryId: categories[3].id, category: categories[3], paid: false, date: '25/08/2020', amount: '3500,00', type: 'expense' } as Entry,
    ];

    return { categories, entries };
  }
}
