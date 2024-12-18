import React from "react";
import { NavLink } from "react-router-dom";
import { postStore, accountStore } from "../../store/store";
import style from "./TextWithLinks.module.css";

interface IText {
  text: string;
  hashtags: string[];
  user_links: string[];
}

interface ILinksIndexes {
  indexes: number[];
  key: string;
}

const TextWithLinks: React.FC<IText> = text => {
  const setIsOpenedPostModalWindow = postStore(state => state.setIsOpenedPostModalWindow);
  const setReloudAccountPage = accountStore(state => state.setReloudAccountPage);

  const links = [text.hashtags, text.user_links];
  const linksIndexes: ILinksIndexes[] = [];

  links.map((arr, n) => {
    if (arr.length > 0) {
      arr.map(el => {
        const startIndex = text.text.indexOf(el);
        const endIndex = startIndex + el.length;
        linksIndexes.push({
          indexes: [startIndex, endIndex],
          key: n === 0 ? "#" : "@"
        });
      });
    }
  });

  linksIndexes.sort((a, b) => a.indexes[0] - b.indexes[0]);

  return (
    <div className={style.textContainer}>
      {linksIndexes.length > 0 ? (
        linksIndexes.map((el, i) => (
          <div key={`textPartId-${i}`}>
            {i === 0 ? (
              text.text.slice(0, el.indexes[0])
            ) : text.text[linksIndexes[i - 1].indexes[1]] === " " ? (
              // иначе пропускает пробел в начале slice
              <span>
                &nbsp;{text.text.slice(linksIndexes[i - 1].indexes[1] + 1, el.indexes[0])}
              </span>
            ) : (
              text.text.slice(linksIndexes[i - 1].indexes[1], el.indexes[0])
            )}
            <NavLink
              to={
                el.key === "@"
                  ? `/accounts/${text.text.slice(el.indexes[0] + 1, el.indexes[1])}`
                  : // посты по тэгу
                    `/explore/tags/${text.text.slice(el.indexes[0] + 1, el.indexes[1])}`
              }
              onClick={() => {
                setIsOpenedPostModalWindow(false);
                // чтобы перезагрузился AccountPage и выполнился request по новому юзеру
                setReloudAccountPage();
              }}
              className={style.link}
            >
              {text.text.slice(el.indexes[0], el.indexes[1])}
            </NavLink>
          </div>
        ))
      ) : (
        <div>{text.text}</div>
      )}
    </div>
  );
};

export default TextWithLinks;
