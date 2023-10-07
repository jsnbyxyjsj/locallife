import { useContext, createContext } from "react";

interface UserData {
  platform_users_id: string;
  name: string;
  last_name: string;
  profile_image: string;
  email: string;
}

interface UserConfiguration {
  platform_configurations_id: string,
  sections: {
    section_name: string;
    pages: {
      page_name: string;
      elements: {
        id: string;
        element_type: string;
        table_name: string;
        table_id: string;
        columns: string[];
        data: any;
        label: string;
        query_name: string;
        query: string;
        query_name_x: string;
        query_x: string;
        query_name_y: string;
        query_y: string;
        variables: {
          limit: number;
          offset: number;
          order: string;
          columns_like: any;
          filters: any;
        };
        filters: {
          global: {
            value: any;
            matchMode: string;
          };
        };
      }[];
    }[];
  }[];
}
interface AppContextType {
  isAuthenticated: Boolean;
  setIsAuthenticated: any;
  userToken: string | null;
  setUserToken: any;
  userData: UserData | null;
  setUserData: any;
  userConfiguration: UserConfiguration | null;
  setUserConfiguration: any;
  currentSection: string;
  setCurrentSection: any;
  currentPage: string;
  setCurrentPage: any;
  navBarOpened: boolean,
  setNavBarOpened: any;
}

const defaultValues = {
  isAuthenticated: false,
  setIsAuthenticated: (_isAuthenticated: boolean) => {},
  userToken: null,
  setUserToken: (_userToken: any) => {},
  userData: null,
  setUserData: (_userData: any) => {},
  userConfiguration: null,
  setUserConfiguration: (_userConfiguration: any) => {},
  currentSection: "",
  setCurrentSection: (_userName: string) => {},
  currentPage: "",
  setCurrentPage: (_userName: string) => {},
  navBarOpened: true,
  setNavBarOpened: (_navBarOpened: boolean) => {}
};

export const AppContext = createContext<AppContextType>(defaultValues);

export function useAppContext() {
  return useContext(AppContext);
}
