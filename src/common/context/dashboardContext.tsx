import React from 'react';
import { UserBookmarks, Bookmark } from '../../common/types/bookmarks'


export interface DashboardContextType {
    userBookmarks: UserBookmarks | undefined;
    setUserBookmarks: (bookmarks: any) => any;
    addBookmark: (bookmark: Bookmark) => void;
    removeBookmark: (bookmark: Bookmark) => void;
}

//export const DashboardContext: DashboardContextType = {
//    userBookmarks: undefined 
//};

export const initialContext: DashboardContextType = {
    userBookmarks: undefined,
    setUserBookmarks: () => { },
    addBookmark: () => { },
    removeBookmark: () => { }
}

export const DashboardContext = React.createContext<DashboardContextType>(initialContext);