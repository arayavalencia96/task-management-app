import { PaginationState } from './pagination.interface';
import { selectCurrentPage, selectItemsPerPage } from './pagination.selectors';

describe('Task Selectors', () => {
  const initialState: PaginationState = {
    currentPage: 1,
    itemsPerPage: 10,
  };

  it('should select the current page', () => {
    /* La propiedad projector es una función que NgRx utiliza para proyectar (o mapear) el estado
        de la aplicación en el valor derivado. Se puede usar directamente en los tests para
        evitar tener que configurar un estado del store y solamente probar la lógica del selector. */
    const result = selectCurrentPage.projector(initialState);
    expect(result).toBe(1);
  });

  it('should select the items per page', () => {
    const result = selectItemsPerPage.projector(initialState);
    expect(result).toBe(10);
  });
});
