import { BookmarksService } from '../../services/bookmarks/bookmarks.service';

export const bookmarksTestService = {};

Object.getOwnPropertyNames(BookmarksService.prototype).forEach(prop => {
  if (prop !== 'constructor') {
    bookmarksTestService[prop] = () => {};
  }
});