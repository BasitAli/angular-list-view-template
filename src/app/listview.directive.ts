import {Directive, Input, Output, ViewChildren, ElementRef, ViewContainerRef, TemplateRef, EmbeddedViewRef, EventEmitter, HostListener} from "@angular/core";


@Directive({
  selector : '[listOf]',
  exportAs : 'listView'
})
export class ListView {
  selectedItems = [];
  activeItem = 0;

  @Input() listOf = [];
  @Output() onSelectionChanged = new EventEmitter();

  constructor(private _element: ElementRef,  private _vr: ViewContainerRef, private _tr: TemplateRef<any>) {}

  ngOnInit() {
    console.log(this._element);
    // document.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }

  ngOnChanges(changes) {
    this._vr.clear();

    const count = this.listOf.length;
    const rows = this.listOf.map((item, index) => {
      const row = {item, index, count};
      let view = this._vr.createEmbeddedView(this._tr, row);
      // view.rootNodes[0].addEventListener('click', (event) => this.handleClick(event, index));
      return row;
    });

    // this.updateItemState();
  }

}
