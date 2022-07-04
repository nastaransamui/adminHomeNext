import {
  getGridBooleanOperators,
  getGridDateOperators,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import {
  RenderCellExpand,
  RenderCellBoolean,
  RenderCellDate,
  RenderCellAvatar,
  RenderCellVideo,
  DateFilters,
  RenderArrayTotal,
  RenderArray,
  RenderIcon,
} from './RenderCell';

export const createColumns = (dataGridColumns, props, t) => {
  let colomn = [];
  for (let index = 0; index < dataGridColumns.length; index++) {
    const element = dataGridColumns[index];
    colomn.push({
      field: element.field,
      cellClassName: 'super-app-theme--cell',
      type: element.type,
      filterable: element.filterable,
      searchAble: element.searchAble,
      headerName: t(`${element.description}`),
      headerAlign: element.headerAlign,
      description: t(`${element.description}`),
      width: element.width,
      renderCell: (params) => {
        return (
          <>
            {element?.hasIcon !== undefined && element?.hasIcon[0] ? (
              <RenderIcon
                dataGridColumns={dataGridColumns}
                modelName={props.modelName}
                rtlActive={props.rtlActive}
                {...params}
              />
            ) : element.type == 'boolean' ? (
              <RenderCellBoolean modelName={props.modelName} {...params} />
            ) : element.type == 'dateTime' ? (
              <RenderCellDate modelName={props.modelName} {...params} />
            ) : element.type == 'array' ? (
              element.arrayTotal ? (
                <RenderArrayTotal modelName={props.modelName} {...params} />
              ) : (
                <RenderArray
                  type={element.type}
                  t={t}
                  modelName={props.modelName}
                  {...params}
                />
              )
            ) : element.hasVideo[0] ? (
              <RenderCellVideo
                dataGridColumns={dataGridColumns}
                modelName={props.modelName}
                rtlActive={props.rtlActive}
                {...params}
              />
            ) : element.hasAvatar[0] ? (
              <RenderCellAvatar
                activesId={props.activesId}
                dataGridColumns={dataGridColumns}
                modelName={props.modelName}
                {...params}
              />
            ) : (
              <RenderCellExpand
                type={element.type}
                modelName={props.modelName}
                {...params}
              />
            )}
          </>
        );
      },
    });
  }
  return colomn;
};

export const LocateText = () => {
  const { t } = useTranslation('dataGridLocale');
  return {
    toolbarDensity: t('toolbarDensity'),
    toolbarDensityLabel: t('toolbarDensityLabel'),
    toolbarDensityCompact: t('toolbarDensityCompact'),
    toolbarDensityStandard: t('toolbarDensityStandard'),
    toolbarDensityComfortable: t('toolbarDensityComfortable'),
    columnsPanelTextFieldLabel: t('columnsPanelTextFieldLabel'),
    columnsPanelTextFieldPlaceholder: t('columnsPanelTextFieldPlaceholder'),
    columnsPanelDragIconLabel: t('columnsPanelDragIconLabel'),
    columnsPanelShowAllButton: t('columnsPanelShowAllButton'),
    columnsPanelHideAllButton: t('columnsPanelHideAllButton'),
    toolbarColumns: t('toolbarColumns'),
    toolbarColumnsLabel: t('toolbarColumnsLabel'),
    toolbarFilters: t('toolbarFilters'),
    toolbarFiltersLabel: t('toolbarFiltersLabel'),
    toolbarFiltersTooltipHide: t('toolbarFiltersTooltipHide'),
    toolbarFiltersTooltipShow: t('toolbarFiltersTooltipShow'),
    toolbarFiltersTooltipActive: (count) =>
      count !== 1
        ? `${count} ${t('toolbarFiltersTooltipActive1')}`
        : `${count} ${t('toolbarFiltersTooltipActive2')}`,
    // Filter panel text
    filterPanelAddFilter: t('filterPanelAddFilter'),
    filterPanelDeleteIconLabel: t('filterPanelDeleteIconLabel'),
    filterPanelLinkOperator: t('filterPanelLinkOperator'),
    filterPanelOperators: t('filterPanelOperators'),
    filterPanelOperatorAnd: t('filterPanelOperatorAnd'),
    filterPanelOperatorOr: t('filterPanelOperatorOr'),
    filterPanelColumns: t('filterPanelColumns'),
    filterPanelInputLabel: t('filterPanelInputLabel'),
    filterPanelInputPlaceholder: t('filterPanelInputPlaceholder'),
    filterOperatorContains: t('filterOperatorContains'),
    filterOperatorEquals: t('filterOperatorEquals'),
    filterOperatorStartsWith: t('filterOperatorStartsWith'),
    filterOperatorEndsWith: t('filterOperatorEndsWith'),
    filterOperatorIs: t('filterOperatorIs'),
    filterOperatorNot: t('filterOperatorNot'),
    filterOperatorAfter: t('filterOperatorAfter'),
    filterOperatorOnOrAfter: t('filterOperatorOnOrAfter'),
    filterOperatorBefore: t('filterOperatorBefore'),
    filterOperatorOnOrBefore: t('filterOperatorOnOrBefore'),
    filterOperatorIsEmpty: t('filterOperatorIsEmpty'),
    filterOperatorIsNotEmpty: t('filterOperatorIsNotEmpty'),
    filterOperatorIsAnyOf: t('filterOperatorIsAnyOf'),
    noRowsLabel: t('noRowsLabel'),
    noResultsOverlayLabel: t('noResultsOverlayLabel'),
    errorOverlayDefaultLabel: t('errorOverlayDefaultLabel'),
    columnMenuLabel: t('columnMenuLabel'),
    columnMenuShowColumns: t('columnMenuShowColumns'),
    columnMenuFilter: t('columnMenuFilter'),
    columnMenuHideColumn: t('columnMenuHideColumn'),
    columnMenuUnsort: t('columnMenuUnsort'),
    columnMenuSortAsc: t('columnMenuSortAsc'),
    columnMenuSortDesc: t('columnMenuSortDesc'),
    filterValueAny: t('filterValueAny'),
    filterValueTrue: t('filterValueTrue'),
    filterValueFalse: t('filterValueFalse'),
  };
};

export const CustomFilterInputs = (columns) => {
  //Datetime
  // render custom Option of the filed
  const dateTimeFilterOperators = getGridDateOperators(true).map(
    (operator) => ({
      ...operator,
      InputComponent: operator.InputComponent ? DateFilters : undefined,
    })
  );

  // Find all indexes of columns
  const dataTimeFieldsIndex = columns.reduce(
    (r, v, i) => r.concat(v.type === 'dateTime' ? i : []),
    []
  );
  //Rplace custom filter
  dataTimeFieldsIndex.map((e, i) => {
    columns[e] = {
      ...columns[e],
      filterOperators: dateTimeFilterOperators,
    };
  });

  // Boolean

  const booleanFilterOperators = getGridBooleanOperators().map((operator) => {
    return {
      ...operator,
    };
  });

  const booleanFieldsIndex = columns.reduce(
    (r, v, i) => r.concat(v.type === 'boolean' ? i : []),
    []
  );

  booleanFieldsIndex.map((e, i) => {
    columns[e] = {
      ...columns[e],
      filterOperators: booleanFilterOperators,
    };
  });
};
