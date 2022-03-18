export const dataTable = (mapData, objecData) => {
  let result = [];
  for (let index = 0; index < mapData.length; index++) {
    const element = mapData[index];
    objecData[element.country_code] = element.firstNumber;
    result.push([
      <img
        src={`/admin/images/flags/${element.flag}`}
        alt={element[`country_${showLang}`]}
        key={'flag'}
      />,
      element[`country_${showLang}`],
      tableValuesLocaleConvert(`${element.firstNumber}`, rtlActive),
      tableValuesLocaleConvert(
        `${rtlActive ? `%${element.percentage}` : `${element.percentage}%`}`,
        rtlActive
      ),
    ]);
  }

  return result;
};
