import { TestBed } from '@angular/core/testing';
import { ContextMenuService } from './context-menu.service';

describe('ContextMenuService', () => {

  let service: ContextMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('emits context menu items', (doneFn) => {

    const items = [{ id: '1', text: '1' }, { id: '2', text: '2' }, { id: '3', text: '3' }]

    service.contextMenu$.subscribe(emitValue => {
      expect(emitValue.items.length).toBe(items.length);
      doneFn();
    });

    service.openContextMenu(items);

  });

});
