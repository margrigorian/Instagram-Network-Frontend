import React from "react";
import SearchInput from "../search_input/SearchInput";
import ListedAccount from "../listed_account/ListedAccount";
import { searchStore } from "../../store/searchStore";
import style from "./SearchDrawer.module.css";
import { Drawer } from "@mui/material";

const SearchDrawer: React.FC = () => {
  const isOpenedSearchDrawer = searchStore(state => state.isOpenedSearchDrawer);
  const setIsOpenedSearchDrawer = searchStore(state => state.setIsOpenedSearchDrawer);
  const search = searchStore(state => state.search);
  const setSearch = searchStore(state => state.setSearch);
  const searchAccounts = searchStore(state => state.searchAccounts);
  const setSearchAccounts = searchStore(state => state.setSearchAccounts);

  return (
    <Drawer
      open={isOpenedSearchDrawer}
      sx={{ zIndex: 0 }}
      onClick={() => {
        setIsOpenedSearchDrawer(false);
        setSearch("");
        setSearchAccounts([]);
      }}
    >
      <div className={style.container} onClick={e => e.stopPropagation()}>
        <div className={style.searchContainer}>
          <div className={style.searchTitle}>Поисковой запрос</div>
          <SearchInput />
        </div>
        <div className={style.accountsContainer}>
          {searchAccounts.length === 0 && search ? (
            <div className={style.notFoundWarning}>
              <div>Ничего не найдено</div>
            </div>
          ) : (
            searchAccounts.map((el, i) => (
              <div key={`accountId-${i}`} className={style.accountContainer}>
                <ListedAccount listedAccount={el} />
              </div>
            ))
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default SearchDrawer;
