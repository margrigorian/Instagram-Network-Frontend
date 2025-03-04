import React from "react";
import { searchStore } from "../../store/searchStore";
import style from "./SearchInput.module.css";
import * as Icon from "react-bootstrap-icons";

const SearchInput: React.FC = () => {
  const search = searchStore(state => state.search);
  const setSearch = searchStore(state => state.setSearch);

  return (
    <div className={style.searchInputContainer}>
      <Icon.Search style={{ color: "grey" }} />
      <input
        placeholder="Поиск"
        className={style.searchInput}
        value={search}
        onChange={e => {
          setSearch(e.target.value);
        }}
      />
      {search ? (
        <Icon.XCircleFill
          style={{ fontSize: "14px", cursor: "pointer" }}
          onClick={() => {
            setSearch("");
          }}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default SearchInput;
