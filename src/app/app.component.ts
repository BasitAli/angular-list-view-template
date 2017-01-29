import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  listItems = [
    "Titus Arias",
    "Charles Craig",
    "Rafael Jones",
    "Ben Small",
    "Sheldon Howe",
    "Cheyenne Chung",
    "Jon Roy",
    "Tony Brock",
    "Harper Melendez",
    "Leslie Baldwin",
    "Will Allen",
    "Justin Blevins",
    "Izabelle Kramer",
    "Antoine Oliver",
    "Sage Roberts",
    "Colt Li",
    "Jimena Wise",
    "Jasper Gentry",
    "Marilyn Benson",
    "Kadyn Paul"
  ];

  selectedItems: string[] = [];
  onListSelectionChanged(items) {
    this.selectedItems = items || [];
  }

  @ViewChild("list") listView;
  ngAfterViewInit() {
    this.listView.requestFocus();
  }

}
