import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

export type ContextMenuItem = { id: string, text: string };

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent implements OnInit {

  @Input() public items: ContextMenuItem[];
  @Output() public itemSelected = new EventEmitter<string>();
  @ViewChild(MatMenuTrigger) public menuTrigger: MatMenuTrigger;

  public position: { x: number, y: number } = { x: 0, y: 0 };
  public isOpen = false;
  public opening = true;

  @HostListener("window:contextmenu") public onWindowContextMenu() { this.forceSingleContextMenu(); }
  @HostListener("window:click") public onWindowClick() { this.forceSingleContextMenu(); }

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  public open(ev: MouseEvent): void {
    
    ev.preventDefault();

    this.isOpen = true;
    this.opening = true;
    this.position = { x: ev.clientX, y: ev.clientY };

    this.cd.detectChanges();
    this.menuTrigger.menu.focusFirstItem('mouse');
    this.menuTrigger.openMenu();
    this.cd.detectChanges();

  }

  public close(): void {
    this.menuTrigger.closeMenu();
    this.cd.detectChanges();
  }

  public emitItemSelected(id: string): void {
    this.itemSelected.emit(id);
  }

  private forceSingleContextMenu(): void {
    if (this.isOpen && !this.opening) {
      this.isOpen = false;
      this.close();
    }

    this.opening = false;
  }

}
