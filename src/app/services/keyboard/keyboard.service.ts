import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Subject, Subscription } from 'rxjs';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { BookmarkTypes } from 'src/app/models/bookmark-types.model';
import { BookmarksService } from '../bookmarks/bookmarks.service';

type BookmarkListNode = { prev: BookmarkListNode, next: BookmarkListNode, model: BookmarkBaseModel };

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  public activeId$ = new BehaviorSubject<string>(null);
  public keyboardInput$ = new Subject();
  public closeEvent$ = new Subject();

  private subscriptions: Subscription[] = [];
  private topLevelIds: string[];
  private activeId: string;
  private listMap: { [id: string]: BookmarkListNode };

  constructor(@Inject(DOCUMENT) private document: any, private bookmarksService: BookmarksService) { }

  public init(): void {

    // Keep track of the top level ids so we know the first item in the three
    const topLevelIdsSubscription = this.bookmarksService.topLevelIds$.subscribe((ids) => {
      this.topLevelIds = ids;
    });

    // Listen to document keyboard events
    const keyupSubscription = fromEvent<KeyboardEvent>(this.document, 'keydown').subscribe((ev) => {

      // Build a linked list of bookmarks so we can determine which bookmark is next/prev in the list
      this.buildBookmarkLinkedList();

      // Toggle the active folder when the user clicks "enter"
      if (ev.key === 'Enter' && this.activeId) {

        let bookmark = this.bookmarksService.getBookmark(this.activeId);

        // If the bookmark is a folder, open/close it
        if (bookmark.type === BookmarkTypes.Folder) {
          this.bookmarksService.toggleFolderOpenOrClosed(bookmark.id);
        } 
        
        // Otherwise, open the bookmark in the current tab
        else {
          this.bookmarksService.openInCurrentTab(bookmark as BookmarkLinkModel);
        }

      }

      // Move "up" in the bookmarks list in response to the "up arrow" key
      else if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        if (this.activeId == null) {
          this.setActiveId(this.topLevelIds[this.topLevelIds.length - 1]);
        } else {
          this.setActiveId(this.listMap[this.activeId]?.prev?.model.id);
        }
      }

      // Move "down" in the bookmarks list in response to the "down arrow" key
      else if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        if (this.activeId == null) {
          this.setActiveId(this.topLevelIds[0]);
        } else {
          this.setActiveId(this.listMap[this.activeId]?.next?.model.id);
        }
      }

      // On escape key, if a search is active, clear it, otherwise close the popup window
      else if (ev.key === 'Escape') {
        ev.preventDefault();
        this.closeEvent$.next();
      }

      // Otherwise, on keydown focus the search input
      else {
        this.keyboardInput$.next();
        this.setActiveId(null);
      }

    });

    // Stop listening when the mouse moves
    const mouseMoveSubscription = fromEvent<MouseEvent>(this.document, 'mousemove').subscribe(() => {
      if (this.activeId) {
        this.setActiveId(null);
      }
    });

    // Stop listening when a click occurs
    const clickSubscription = fromEvent<MouseEvent>(this.document, 'click').subscribe(() => {
      if (this.activeId) {
        this.setActiveId(null);
      }
    });

    // Store all subscriptions so they can later be destroyed
    this.subscriptions.push(topLevelIdsSubscription);
    this.subscriptions.push(keyupSubscription);
    this.subscriptions.push(mouseMoveSubscription);
    this.subscriptions.push(clickSubscription);

  }

  public destroy(): void {

    // Kill all existing subscriptions
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });

  }

  private setActiveId(id: string): void {

    // Update the active id
    this.activeId = id;
    this.activeId$.next(id);

    // Scroll the bookmark base into view
    const element = document.querySelector(`[data-bookmarkId="${id}"]`);
    if (element) {
      scrollIntoView(element as HTMLElement);
    }

  }

  private buildBookmarkLinkedList(): void {

    this.listMap = {};

    let firstNodes: { start: BookmarkListNode, end: BookmarkListNode };
    let previousNodes: { start: BookmarkListNode, end: BookmarkListNode };

    // Generate the linked list
    for (let i = 0; i < this.topLevelIds.length; i++) {

      const newNodes = this.createLinkedListNode(this.bookmarksService.getBookmark(this.topLevelIds[i]));

      // If this is the first item in the list, track the start of the list
      if (i === 0) {
        firstNodes = newNodes;
      }

      // Connect two nodes in the center of the linked list
      if (i !== 0 && i !== this.topLevelIds.length) {
        previousNodes.end.next = newNodes.start;
        newNodes.start.prev = previousNodes.end;
      }

      // If this is the last item, connect the start and end of the list (circular linked list)      
      if (i === this.topLevelIds.length) {
        newNodes.end.next = firstNodes.start;
        firstNodes.start.prev = newNodes.end;
      } 

      previousNodes = newNodes;

    }

  }

  private createLinkedListNode(model: BookmarkBaseModel): { start: BookmarkListNode, end: BookmarkListNode } {

    const node: BookmarkListNode = { next: null, prev: null, model }
    this.listMap[model.id] = node;

    // If the model is a link, it is both the start and end nodes
    if (model.type === BookmarkTypes.Link) {
      return { start: node, end: node };
    } 
    
    // If the model is a closed folder or has no children, it is also both the start and end nodes
    else if ((model as BookmarkFolderModel).isOpen === false || (model as BookmarkFolderModel).children.length === 0) {
      return { start: node, end: node };
    } 
    
    // Determine the start and end nodes for this bookmark and it's children
    else {

      let startNode = node;
      let endNode: BookmarkListNode = null;
      let previousNodes: { start: BookmarkListNode, end: BookmarkListNode } = null;
      (model as BookmarkFolderModel).children.forEach(id => {

        const childModel = this.bookmarksService.getBookmark(id);
        const childNodes = this.createLinkedListNode(childModel);
        endNode = childNodes.end;

        if (previousNodes) {
          previousNodes.end.next = childNodes.start;
          childNodes.start.prev = previousNodes.end;
        } else {
          startNode.next = childNodes.start;
          childNodes.start.prev = startNode;
        }

        previousNodes = childNodes;

      });

      return { start: startNode, end: endNode };

    }

  }

}

function scrollIntoView(element: HTMLElement): void {

	let targetTop = element.getBoundingClientRect().top;
	let targetBottom = element.getBoundingClientRect().bottom;

  // Scroll down to the target.
	if ((targetTop >= 0) && (targetBottom >= window.innerHeight)) {
		element.scrollIntoView(false);
  } 
  
  // Scroll up to the target.
  else if (targetTop < 0) {
		element.scrollIntoView(true);
  }

}
