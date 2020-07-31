import { BookmarkBaseModel } from "./bookmark-base.model";
import { BookmarkTypes } from "./bookmark-types.model";

// Models link nodes in the bookmarks tree
export class BookmarkLinkModel extends BookmarkBaseModel {

  public url: string;
  public icon: string;
  public readonly type = BookmarkTypes.Link;

  constructor(node: chrome.bookmarks.BookmarkTreeNode) {
    super(node);
    this.url = node.url;
    this.icon = "chrome://favicon/" + node.url;
  }

}
