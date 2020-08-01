import type { BookmarkTypes } from "./bookmark-types.model";

// A common model for all bookmark types to inherit from
export class BookmarkBaseModel {

  public id: string;
  public parentId: string;
  public title: string;
  public modifiable = true;
  public readonly type: BookmarkTypes;

  constructor(node: chrome.bookmarks.BookmarkTreeNode) {
    this.id = node.id;
    this.parentId = node.parentId;
    this.title = node.title;
    this.modifiable = !node.unmodifiable;
  }

}