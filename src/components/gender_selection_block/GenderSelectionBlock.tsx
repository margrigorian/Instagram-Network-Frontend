import React, { useState, Dispatch, SetStateAction } from "react";
import style from "./GenderSelectionBlock.module.css";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

interface IGenderSelectionInfoProps {
  isOpenedModalGenderSelectionWindow: boolean;
  setIsOpenedModalGenderSelectionWindow: Dispatch<SetStateAction<boolean>>;
  backendGenderValue: string | null;
  setBackendGenderValue: Dispatch<SetStateAction<string | null>>;
  individualGenderType: string;
  setIndividualGenderType: Dispatch<SetStateAction<string>>;
}

const GenderSelectionBlock: React.FC<IGenderSelectionInfoProps> = ({
  isOpenedModalGenderSelectionWindow,
  setIsOpenedModalGenderSelectionWindow,
  backendGenderValue,
  setBackendGenderValue,
  individualGenderType,
  setIndividualGenderType
}) => {
  let genderValue;
  // преобразуем значения для фронтенда
  // "#1female" - чтобы было различие от вручную заполненного female, #1 - доп. код должен быть сложнее
  if (backendGenderValue === "#1female") {
    genderValue = "Женский";
  } else if (backendGenderValue === "#2male") {
    genderValue = "Мужской";
  } else if (backendGenderValue === null) {
    genderValue = "Предпочитаю не указывать";
  } else {
    genderValue = "Свой вариант";
    setIndividualGenderType(backendGenderValue);
  }
  const [frontendGenderValue, setFrontendGenderValue] = useState(genderValue);

  return (
    <div className={style.containerOfEditingGenderItem}>
      <div className={style.headerTextOfEditingGenderItem}>Пол</div>
      <div className={style.genderContainer}>
        <div
          onClick={e => {
            e.stopPropagation();
            setIsOpenedModalGenderSelectionWindow(!isOpenedModalGenderSelectionWindow);
          }}
          className={style.genderSelectionInput}
          style={
            frontendGenderValue === "Свой вариант" && !individualGenderType
              ? { borderColor: "red" }
              : { borderColor: "lightgrey" }
          }
        >
          <div>
            {frontendGenderValue === "Свой вариант" ? individualGenderType : frontendGenderValue}
          </div>
          <div>
            <KeyboardArrowDownOutlinedIcon sx={{ color: "lightgrey" }} />
          </div>
        </div>
        {isOpenedModalGenderSelectionWindow ? (
          <div
            onClick={e => {
              e.stopPropagation();
            }}
            className={style.genderListContainer}
          >
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={frontendGenderValue}
                value={frontendGenderValue}
                name="radio-buttons-group"
              >
                <div
                  onClick={() => {
                    setFrontendGenderValue("Женский");
                    setBackendGenderValue("#1female");
                    // чтобы исключить лишний рендеринг
                    if (individualGenderType) {
                      setIndividualGenderType("");
                    }
                    setIsOpenedModalGenderSelectionWindow(false);
                  }}
                  className={style.genderListItem}
                >
                  <FormControlLabel
                    value="Женский"
                    // через клик на label почему-то не передается value
                    // onClick={e => {
                    //   const radioButton = e.target as HTMLInputElement;
                    //   setFrontendGenderValue(radioButton.value);
                    // }}
                    label="Женский"
                    labelPlacement="start"
                    sx={{
                      ".MuiFormControlLabel-label": {
                        fontSize: "14.5px",
                        letterSpacing: "1px",
                        color: "black",
                        padding: "0 222px 0 4px"
                      },
                      ".MuiFormControlLabel-label:hover": {
                        color: "#2196f3"
                      }
                    }}
                    control={
                      <Radio
                        sx={{
                          color: "lightgrey",
                          "&.Mui-checked": {
                            color: "black"
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: "28px"
                          }
                        }}
                      />
                    }
                  />
                </div>
                <div
                  onClick={() => {
                    setFrontendGenderValue("Мужской");
                    setBackendGenderValue("#2male");
                    // чтобы исключить лишний рендеринг
                    if (individualGenderType) {
                      setIndividualGenderType("");
                    }
                    setIsOpenedModalGenderSelectionWindow(false);
                  }}
                  className={style.genderListItem}
                >
                  <FormControlLabel
                    value="Мужской"
                    // через клик на label почему-то не передается value
                    // onClick={e => {
                    //   const radioButton = e.target as HTMLInputElement;
                    //   setFrontendGenderValue(radioButton.value);
                    // }}
                    label="Мужской"
                    labelPlacement="start"
                    sx={{
                      ".MuiFormControlLabel-label": {
                        fontSize: "14.5px",
                        letterSpacing: "1px",
                        color: "black",
                        padding: "0 222px 0 4px"
                      },
                      ".MuiFormControlLabel-label:hover": {
                        color: "#2196f3"
                      }
                    }}
                    control={
                      <Radio
                        sx={{
                          color: "lightgrey",
                          "&.Mui-checked": {
                            color: "black"
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: "28px"
                          }
                        }}
                      />
                    }
                  />
                </div>
                <div className={style.genderListItem}>
                  <FormControlLabel
                    value="Свой вариант"
                    onClick={e => {
                      const radioButton = e.target as HTMLInputElement;
                      setFrontendGenderValue(radioButton.value);
                    }}
                    label="Свой вариант"
                    labelPlacement="start"
                    sx={{
                      ".MuiFormControlLabel-label": {
                        fontSize: "14.5px",
                        letterSpacing: "1px",
                        color: "black",
                        padding: "0 182px 0 4px"
                      },
                      ".MuiFormControlLabel-label:hover": {
                        color: "#2196f3"
                      }
                    }}
                    control={
                      <Radio
                        sx={{
                          color: "lightgrey",
                          "&.Mui-checked": {
                            color: "black"
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: "28px"
                          }
                        }}
                      />
                    }
                  />
                </div>
                <input
                  value={individualGenderType}
                  onClick={() => {
                    // чтобы исключить лишний рендеринг
                    if (individualGenderType !== "Свой вариант") {
                      setFrontendGenderValue("Свой вариант");
                    }
                  }}
                  onChange={e => {
                    setIndividualGenderType(e.target.value);
                  }}
                  className={style.individualGenderTypeInput}
                  style={
                    frontendGenderValue === "Свой вариант" && !individualGenderType
                      ? { borderColor: "red" }
                      : { borderColor: "lightgrey" }
                  }
                />
                <div
                  onClick={() => {
                    setFrontendGenderValue("Предпочитаю не указывать");
                    setBackendGenderValue(null);
                    // чтобы исключить лишний рендеринг
                    if (individualGenderType) {
                      setIndividualGenderType("");
                    }
                    setIsOpenedModalGenderSelectionWindow(false);
                  }}
                  className={style.genderListItem}
                >
                  <FormControlLabel
                    value="Предпочитаю не указывать"
                    // через клик на label почему-то не передается value
                    // onClick={e => {
                    //   const radioButton = e.target as HTMLInputElement;
                    //   setFrontendGenderValue(radioButton.value);
                    // }}
                    label="Предпочитаю не указывать"
                    labelPlacement="start"
                    sx={{
                      ".MuiFormControlLabel-label": {
                        fontSize: "14.5px",
                        letterSpacing: "1px",
                        color: "black",
                        padding: "0 78px 0 4px"
                      },
                      ".MuiFormControlLabel-label:hover": {
                        color: "#2196f3"
                      }
                    }}
                    control={
                      <Radio
                        sx={{
                          color: "lightgrey",
                          "&.Mui-checked": {
                            color: "black"
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: "28px"
                          }
                        }}
                      />
                    }
                  />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className={style.explanatoryText}>
        Эта информация не будет показываться в вашем общедоступном профиле.
      </div>
    </div>
  );
};

export default GenderSelectionBlock;
