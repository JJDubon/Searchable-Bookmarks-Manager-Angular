import { BookmarkBaseModel } from "./bookmark-base.model";
import { BookmarkTypes } from "./bookmark-types.model";

// Models folder nodes in the bookmarks tree
export class BookmarkFolderModel extends BookmarkBaseModel {

  public children: string[];
  public isOpen: boolean;
  public readonly type = BookmarkTypes.Folder;

  constructor(node: chrome.bookmarks.BookmarkTreeNode, isOpen = false) {
    super(node);
    this.children = node.children?.map(x => x.id) ?? [];
    this.isOpen = isOpen;
  }

}
