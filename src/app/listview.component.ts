import {
  Component, OnInit, Input, Output, EventEmitter,
  ViewChild, ContentChild, ElementRef, TemplateRef, ViewEncapsulation, Renderer,
} from '@angular/core';

export class ListViewRow {
  public selected: boolean = false;
  public active: boolean = false;

  constructor(public $implicit: any, public index: number = 0, public count: number = 0) { }

  get first(): boolean { return this.index === 0; }

  get last(): boolean { return this.index === this.count - 1; }

  get even(): boolean { return this.index % 2 === 0; }

  get odd(): boolean { return !this.even; }
}

@Component({
  selector: 'list-view',
  template: `
  <div #listBody class="list-body" tabindex=0 (keydown)="handleKeyPress($event)">
    <template ngFor let-item let-index="index" [ngForOf]="listItems">
      <div class="list-item-body" (click)="handleClick($event, index)" [attr.data-index]="index">
        <template [ngTemplateOutlet]="template" [ngOutletContext]="item"></template>
      </div>
    </template>
  </div>`,
  styleUrls: ['./listview.component.scss']
})
export class ListViewComponent {

  listItems = [];

  selectedItems = [];
  activeItem = -1;

  @Input() items = [];
  @Output() onSelectionChanged = new EventEmitter();

  @ContentChild(TemplateRef) template;
  @ViewChild("listBody") listBody;

  constructor(private renderer: Renderer) { }

  ngOnChanges(changes) {
    const count = this.items.length;
    this.listItems = this.items.map((item, index) => {
      return new ListViewRow(item, index, count);
    });
  }

  requestFocus() {
    this.listBody.nativeElement.focus();
  }

  handleKeyPress(event: KeyboardEvent) {
    const keyCode = event.which;

    let row = this.activeItem < 0 ? {} : this.listItems[this.activeItem];
    row.active = false;

    const prevActiveItem = this.activeItem;
    switch (keyCode) {
      case 40:
        if (this.activeItem === this.items.length - 1) {
          this.activeItem = 0;
          break;
        }

        this.activeItem++;
        break;

      case 38:
      case 9:
        if (this.activeItem === 0) {
          this.activeItem = this.items.length - 1;
          break;
        }

        this.activeItem--;
        break;

      case 32:
        this.toggleItem(this.activeItem);
        break;

      default:
        return
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.activeItem == prevActiveItem) {
      return;
    }

    if (event.altKey) {
      this.updateItemState();
      return;
    }

    const isSelected = row.selected;
    if (event.shiftKey) {
      row.selected = true;
    }
    else {
      row.selected = false;
      this.selectedItems = [];
    }

    this.selectItem(this.activeItem);
  }

  handleClick(event, index) {
    if (event.metaKey || event.ctrlKey) {
      this.toggleItem(index);
    }
    else {
      this.selectedItems = [];
      this.selectItem(index);
    }
  }

  updateItemState() {
    this.listItems.forEach((row, index) => {
      row.selected = this.selectedItems.indexOf(this.items[index]) >= 0;
      row.active = index == this.activeItem;
    });

    if( this.activeItem >= 0 ) {
      this.scrollItemIntoView(this.activeItem);
    }
  }

  scrollItemIntoView(index) {
    const activeItemEl = (this.listBody.nativeElement as HTMLElement).children.item(index) as HTMLElement;
    const scrollTop = this.listBody.nativeElement.scrollTop;
    const scrollEnd = scrollTop + this.listBody.nativeElement.offsetHeight;
    if(activeItemEl.offsetTop < scrollTop) {
      this.listBody.nativeElement.scrollTop = activeItemEl.offsetTop;
    }
    else if( activeItemEl.offsetTop + activeItemEl.offsetHeight > scrollEnd ) {
      this.listBody.nativeElement.scrollTop = activeItemEl.offsetTop + activeItemEl.offsetHeight - this.listBody.nativeElement.offsetHeight;
    }
    else if(activeItemEl.offsetTop > scrollEnd) {
    }
  }

  toggleItem(index) {
    if (this.selectedItems.indexOf(this.items[index]) >= 0) {
      this.deselectItem(index);
    }
    else {
      this.selectItem(index);
    }
  }

  deselectItem(index) {
    this.selectedItems.splice(this.selectedItems.indexOf(this.items[index]), 1);
    this.updateItemState();
    this.onSelectionChanged.emit(this.selectedItems);
  }

  selectItem(index) {
    this.activeItem = index;
    // (<EmbeddedViewRef<ListViewRow>>this._vr.get(index)).rootNodes[0].scrollIntoView(false);
    this.selectedItems.push(this.items[index]);
    this.updateItemState();
    this.onSelectionChanged.emit(this.selectedItems);
  }

  selectAll() {
    this.selectedItems = this.items.map(l => l);
    this.updateItemState();
    this.onSelectionChanged.emit(this.selectedItems);
  }

  clearSelection() {
    this.selectedItems = [];
    this.updateItemState();
    this.onSelectionChanged.emit(this.selectedItems);
  }

}
