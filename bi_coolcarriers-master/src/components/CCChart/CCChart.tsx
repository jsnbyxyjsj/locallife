import { useEffect, useState } from "react";
import { useAppContext } from "../../libs/contextLib";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  Label,
  ReferenceArea,
} from "recharts";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import Modal from "react-modal";
import { Row, Col } from "react-bootstrap";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { tables_asoex, tables_scsdoc } from "../../libs/tablesReferences";
import loaderGifCC from "../../assets/images/loader-cc.gif";
import { colors, formatWithSeparators } from "../../libs/functions";
import { Calendar } from "primereact/calendar";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function CCChart({ data }: any) {
  const {
    userConfiguration,
    setUserConfiguration,
    currentSection,
    currentPage,
  } = useAppContext();

  const [state, setState] = useState<{
    display_data: any;
    left: string;
    right: string;
    refAreaLeft: string;
    refAreaRight: string;
    top: string;
    bottom: string;
    animation: boolean;
    active: boolean;
  }>({
    display_data: null,
    left: "dataMin",
    right: "dataMax",
    refAreaLeft: "",
    refAreaRight: "",
    top: "dataMax+1",
    bottom: "dataMin-1",
    animation: true,
    active: false,
  });
  const [lazyState, setlazyState] = useState<{
    first: number;
    rows: number;
    page: number;
    sortField: string | null;
    sortOrder: number | null;
    onPage: Boolean | null;
  }>({
    first: 0,
    rows: data.paginator || 5,
    page: 1,
    sortField: null,
    sortOrder: null,
    onPage: false,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [xkey, setXkey] = useState("");
  const [ykey, setYkey] = useState("");
  const [type, setType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditionModal, setEditionShowModal] = useState(false);
  const [onlyView, setOnlyView] = useState(true);
  const [chartFilters, setChartFilters] = useState<any>({});
  const [columnsOptions, setColumnsOptions] = useState<
    { name: string; code: string; type: string }[] | null
  >(null);
  const [showTable, setShowTable] = useState(data.show_table || false);
  const getTableData = () => {
    let columnX = data.columns.find(
      (el: any) => el.column_purpose === "axisX"
    )[0];
    if (!columnX) {
      columnX = data.columns[0];
    }
    let columnY = data.columns.filter(
      (el: any) => el.column_purpose === "axisY"
    )[0];
    let data_: any = {
      column_x: columnX.column_name,
      column_y: columnY ? columnY.column_name : "frequency",
      comparative_columns: [],
    };
    if (data.comparative_data?.active) {
      let n = Object.values(data.comparative_data.data).length;
      let array_aux = [];
      for (let i = 0; i < n; i++) {
        array_aux.push(`${data.yKey}_${i}`);
      }
      data_["comparative_columns"] = array_aux;
    }
    return data_;
  };
  const dataTable = getTableData();
  const filters = {
    [dataTable.column_x]: { value: null, matchMode: FilterMatchMode.CONTAINS },
    [dataTable.column_y]: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };

  const filtersOptions: any = {
    text: [
      { name: "Contains", code: "contains" },
      { name: "Ends With", code: "endsWith" },
      { name: "Equals", code: "equals" },
      { name: "Not contains", code: "notContains" },
      { name: "Not equals", code: "notEquals" },
      { name: "Starts with", code: "startsWith" },
    ],
    number: [
      { name: "Equals", code: "equals" },
      { name: "Not equals", code: "notEquals" },
      { name: "Less than", code: "less_than" },
      { name: "Less than or equal to", code: "lte" },
      { name: "Greater than", code: "greater_than" },
      { name: "Greater than or equal to", code: "gte" },
    ],
    date: [
      { name: "Date is", code: "dateIs" },
      { name: "Date is not", code: "dateIsNot" },
      { name: "Date is before", code: "dateBefore" },
      { name: "Date is after", code: "dateAfter" },
    ],
  };
  const [legend, setLegend] = useState(data.legend);
  const queryX = data.query_x;
  const getInitialVariables = () => {
    let columnX = data.columns.find(
      (el: any) => el.column_purpose === "axisX"
    )[0];
    if (!columnX) {
      columnX = data.columns[0];
    }
    let filters = data.columns
      .filter((el: any) => el.column_purpose === "filter")
      .map(
        (el: any) =>
          el.column_name + "??" + el.filter_value + "??" + el.filter_type
      );
    return {
      table_name: columnX.table_name,
      column_name: columnX.column_name,
      filters: filters.length !== 0 ? JSON.stringify(filters) : null,
    };
  };
  const [variablesX, setVariablesX] = useState(getInitialVariables);
  const {
    loading: loadingQueryX,
    // error: errorQueryX,
    data: dataQueryX,
  } = useQuery(gql(queryX), {
    variables: variablesX,
  });
  const [queryY, setQueryY] = useState<any>({
    query: data.query_x,
    variables: getInitialVariables(),
  });
  const {
    loading: loadingQueryY,
    // error: errorQueryY,
    data: dataQueryY,
  } = useQuery(gql(queryY.query), {
    variables: queryY.variables,
  });
  const buildComparative = (comparative_data_arg = data.comparative_data) => {
    if (!comparative_data_arg?.active) {
      return {
        query: data.query_x,
        variables: getInitialVariables(),
      };
    } else {
      let comparatives: any = Object.values(comparative_data_arg.data);
      let filters_arg = comparatives
        .map((_: any, index: number) => " $filters_" + index + ": JSON")
        .join(",");
      let filters_int = comparatives
        .map(
          (_: any, index: number) =>
            `count_unique_elements_${index}:count_unique_elements(table_name: $table_name, column_name: $column_name, filters: $filters_${index})`
        )
        .join("\n");
      let new_query = `query count_unique_elements($table_name: String!, $column_name: String!,${filters_arg}){
        ${filters_int}
      }`;
      let columnX = data.columns.find(
        (el: any) => el.column_purpose === "axisX"
      )[0];
      if (!columnX) {
        columnX = data.columns[0];
      }
      let variables: any = {
        table_name: columnX.table_name,
        column_name: columnX.column_name,
      };
      for (var i = 0; i < comparatives.length; i++) {
        let filters = comparatives[i].columns.map(
          (el: any) =>
            el.column_name + "??" + el.filter_value + "??" + el.filter_type
        );
        variables["filters_" + i] =
          filters.length !== 0 ? JSON.stringify(filters) : null;
      }
      return {
        query: new_query,
        variables: variables,
      };
    }
  };
  const queryComparative = buildComparative();
  // const [queryComparative, setQueryComparative] =
  //   useState<any>(buildComparative);
  const {
    loading: loadingQueryComparative,
    // error: errorQueryComparative,
    data: dataQueryComparative,
  } = useQuery(gql(queryComparative.query), {
    variables: queryComparative.variables,
  });
  const [queryComparativeY, setQueryComparativeY] = useState<any>({
    query: data.query_x,
    variables: getInitialVariables(),
  });
  const {
    loading: loadingQueryComparativeY,
    // error: errorQueryComparativeY,
    data: dataQueryComparativeY,
  } = useQuery(gql(queryComparativeY.query), {
    variables: queryComparativeY.variables,
  });
  const [comparatives, setComparatives] = useState<any>([]);

  const [updateConfiguration] = useMutation(gql`
    mutation update_platform_configurations(
      $platform_configurations_id: String!
      $dashboard_configuration: String
    ) {
      update_platform_configurations(
        platform_configurations_id: $platform_configurations_id
        dashboard_configuration: $dashboard_configuration
      ) {
        platform_configurations_id
      }
    }
  `);

  const updateComponent = async (
    data_: any,
    reload_forced: boolean = false
  ) => {
    if (userConfiguration) {
      let sections = [...userConfiguration.sections];
      let index = sections.map((el) => el.section_name).indexOf(currentSection);
      let pages = [...sections[index].pages];
      let index_page = pages.map((el) => el.page_name).indexOf(currentPage);
      let elements = [...pages[index_page]["elements"]];
      let index_element = elements.map((el) => el.id).indexOf(data_.id);
      elements[index_element] = data_;
      pages[index_page]["elements"] = elements;
      sections[index].pages = pages;
      let userConfiguration_ = { ...userConfiguration };
      userConfiguration_.sections = sections;
      setUserConfiguration(userConfiguration_);
      // Remove results
      for (var i = 0; i < userConfiguration_.sections.length; i++) {
        let pages = userConfiguration_.sections[i].pages;
        for (var j = 0; j < pages.length; j++) {
          let elements = pages[j].elements;
          for (var k = 0; k < elements.length; k++) {
            userConfiguration_.sections[i].pages[j].elements[k].data = null;
          }
        }
      }
      await updateConfiguration({
        variables: {
          platform_configurations_id:
            userConfiguration_.platform_configurations_id,
          dashboard_configuration: JSON.stringify(userConfiguration_),
        },
      });
      if (reload_forced) {
        window.location.reload();
      }
    }
  };

  const deleteChart = () => {
    if (userConfiguration) {
      let sections = [...userConfiguration.sections];
      let index = sections.map((el) => el.section_name).indexOf(currentSection);
      let pages = [...sections[index].pages];
      let index_page = pages.map((el) => el.page_name).indexOf(currentPage);
      let elements = [...pages[index_page]["elements"]];
      let index_element = elements.map((el) => el.id).indexOf(data.id);
      elements.splice(index_element, 1);
      pages[index_page]["elements"] = elements;
      sections[index].pages = pages;
      let userConfiguration_ = { ...userConfiguration };
      userConfiguration_.sections = sections;
      setUserConfiguration(userConfiguration_);
      // Remove results
      for (var i = 0; i < userConfiguration_.sections.length; i++) {
        let pages = userConfiguration_.sections[i].pages;
        for (var j = 0; j < pages.length; j++) {
          let elements = pages[j].elements;
          for (var k = 0; k < elements.length; k++) {
            userConfiguration_.sections[i].pages[j].elements[k].data = null;
          }
        }
      }
      updateConfiguration({
        variables: {
          platform_configurations_id:
            userConfiguration_.platform_configurations_id,
          dashboard_configuration: JSON.stringify(userConfiguration_),
        },
      });
      setShowModal(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="CCChart__tooltip">
          <p>
            <label>{xkey} :</label> {label}
          </p>
          {payload.map(function (el: any, index: number) {
            return (
              <p style={{ color: el.color }} key={"tooltip-label-" + index}>
                <label style={{ color: el.color }}>{el.name} :</label>{" "}
                {formatWithSeparators(el.value)}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    if (dataQueryX) {
      let columnX = data.columns.find(
        (el: any) => el.column_purpose === "axisX"
      )[0];
      if (!columnX) {
        columnX = data.columns[0];
      }
      let columnY = data.columns.filter(
        (el: any) => el.column_purpose === "axisY"
      )[0];
      if (!columnY) {
        let data_ = dataQueryX.count_unique_elements;
        if (columnX.column_type === "text") {
          setState({ ...state, display_data: data_ });
          setChartData(data_);
          updateComponent({ ...data, data: data_ });
        } else if (columnX.column_type === "number") {
          let n = columnX.n_ranges;
          let last_value = data_.map((el: any) => el[data.xKey])[
            data_.length - 1
          ];
          let range = Array.from({ length: n + 1 }, (_, i) => i).map((el) =>
            Math.round(el * (last_value / n))
          );
          let format_data = [];
          for (var i = 0; i < range.length - 1; i++) {
            let range_name =
              Math.round(range[i]) + "-" + Math.round(range[i + 1]);
            let range_frequency = data_.filter(
              (el: any) =>
                range[i] <= el[data.xKey] && el[data.xKey] < range[i + 1]
            );
            range_frequency = range_frequency.reduce(
              (acc: any, obj: any) => acc + obj.frequency,
              0
            );
            if (i === range.length - 2) {
              range_frequency = range_frequency + 1;
            }
            format_data.push({
              [data.xKey]: range_name,
              frequency: range_frequency,
            });
            setState({ ...state, display_data: format_data });
            setChartData(format_data);
            updateComponent({ ...data, data: format_data });
          }
        }
      } else {
        let array = dataQueryX[data.query_name_x];
        array = array.map((el: any) => el[columnX.column_name]);
        let filters = data.columns
          .filter((el: any) => el.column_purpose === "filter")
          .map(
            (el: any) =>
              el.column_name + "??" + el.filter_value + "??" + el.filter_type
          );
        let variables = {
          arrays: JSON.stringify({ [columnX.column_name]: array }),
          columns_like: filters.length !== 0 ? JSON.stringify(filters) : null,
        };
        setQueryY({
          query: data.query_y,
          variables: variables,
        });
      }
    }
  }, [dataQueryX]);

  useEffect(() => {
    if (dataQueryY && dataQueryY !== dataQueryX) {
      let columnX = data.columns.find(
        (el: any) => el.column_purpose === "axisX"
      )[0];
      if (!columnX) {
        columnX = data.columns[0];
      }
      let columnY = data.columns.filter(
        (el: any) => el.column_purpose === "axisY"
      )[0];
      let data_ = dataQueryY[data.query_name_y];
      let format_obj: any = {};
      for (var i = 0; i < data_.length; i++) {
        let key = data_[i][columnX.column_name];
        let value = parseFloat(data_[i][columnY.column_name]);
        if (!Object.keys(format_obj).includes(key)) {
          format_obj[key] = value;
        } else {
          format_obj[key] = format_obj[key] + value;
        }
      }
      let format_data = Object.keys(format_obj).map(function (el) {
        return {
          [columnX.column_name]: el,
          [columnY.column_name]: format_obj[el],
        };
      });
      format_data = format_data.sort(function (a, b) {
        a = a[columnX.column_name];
        b = b[columnX.column_name];
        return a < b ? -1 : a > b ? 1 : 0;
      });
      setState({ ...state, display_data: format_data });
      setChartData(format_data);
      updateComponent({ ...data, data: format_data });
    }
  }, [dataQueryY]);

  function mergeObjectsByKey(array1: any, array2: any, commonKey: string) {
    const mergedArray = [];

    for (const obj1 of array1) {
      const matchingObj = array2.find(
        (obj2: any) => obj2[commonKey] === obj1[commonKey]
      );

      if (matchingObj) {
        const mergedObj = { ...obj1, ...matchingObj };
        mergedArray.push(mergedObj);
      } else {
        mergedArray.push(obj1);
      }
    }
    for (const obj2 of array2) {
      const matchingObj = array1.find(
        (obj1: any) => obj1[commonKey] === obj2[commonKey]
      );
      if (!matchingObj) {
        mergedArray.push(obj2);
      }
    }
    return mergedArray;
  }
  function completeMissingKeys(array: any) {
    const allKeys = array.reduce((keys: any, obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (!keys.includes(key)) {
          keys.push(key);
        }
      });
      return keys;
    }, []);

    const newArray = array.map((obj: any) => {
      const newObj = { ...obj };
      allKeys.forEach((key: any) => {
        if (!newObj.hasOwnProperty(key)) {
          newObj[key] = 0;
        }
      });
      return newObj;
    });

    return newArray;
  }

  useEffect(() => {
    if (dataQueryComparative && state.display_data) {
      if (!data.comparative_data?.active) {
        return;
      }
      let columnX = data.columns.find(
        (el: any) => el.column_purpose === "axisX"
      )[0];
      if (!columnX) {
        columnX = data.columns[0];
      }
      let columnY = data.columns.filter(
        (el: any) => el.column_purpose === "axisY"
      )[0];
      let comparatives_responses = Object.keys(dataQueryComparative);
      if (!columnY) {
        for (var i = 0; i < comparatives_responses.length; i++) {
          let data_ = dataQueryComparative[comparatives_responses[i]];
          if (columnX.column_type === "text") {
            let merged_data = mergeObjectsByKey(
              data_.map(function (el: any) {
                return {
                  [columnX.column_name]: el[columnX.column_name],
                  ["frequency_" + i]: el.frequency,
                };
              }),
              state.display_data,
              columnX.column_name
            );
            merged_data = completeMissingKeys(merged_data);
            if (
              JSON.stringify(merged_data) !== JSON.stringify(state.display_data)
            ) {
              setState({ ...state, display_data: merged_data });
              setChartData(merged_data);
              updateComponent({ ...data, data: merged_data });
            }
          } else if (columnX.column_type === "number") {
            let format_data = [];
            let range = state.display_data.map(
              (el: any) => el[columnX.column_name]
            );
            range = [...new Set(range.join("-").split("-"))].map((el: any) =>
              parseInt(el)
            );
            for (var j = 0; j < range.length - 1; j++) {
              let range_name =
                Math.round(range[j]) + "-" + Math.round(range[j + 1]);
              let range_frequency = data_.filter(
                (el: any) =>
                  range[j] <= el[data.xKey] && el[data.xKey] < range[j + 1]
              );
              range_frequency = range_frequency.reduce(
                (acc: any, obj: any) => acc + obj.frequency,
                0
              );
              if (j === range.length - 2) {
                range_frequency = range_frequency + 1;
              }
              format_data.push({
                [data.xKey]: range_name,
                frequency: range_frequency,
              });
            }
            let merged_data = mergeObjectsByKey(
              format_data.map(function (el: any) {
                return {
                  [columnX.column_name]: el[columnX.column_name],
                  ["frequency_" + i]: el.frequency,
                };
              }),
              state.display_data,
              columnX.column_name
            );
            merged_data = completeMissingKeys(merged_data);
            if (
              JSON.stringify(merged_data) !== JSON.stringify(state.display_data)
            ) {
              setState({ ...state, display_data: merged_data });
              setChartData(merged_data);
              updateComponent({ ...data, data: merged_data });
            }
          }
        }
      } else {
        let comparatives: any = Object.values(data.comparative_data.data);
        let filters_arg = comparatives
          .map(function (_: any, index: number) {
            return (
              " $arrays_" + index + ": JSON, $columns_like_" + index + ": JSON"
            );
          })
          .join(",");
        let filters_int = comparatives
          .map(
            (_: any, index: number) =>
              `${data.query_name_y}_${index}:${data.query_name_y}(arrays: $arrays_${index}, columns_like: $columns_like_${index}){\n${data.xKey}\n${data.yKey}\n}`
          )
          .join("\n");
        let new_query = `query ${data.query_name_y}(${filters_arg}){
        ${filters_int}
      }`;
        let variables: any = {};
        for (var i = 0; i < comparatives_responses.length; i++) {
          let array: any = Object.values(dataQueryComparative)[i];
          array = array.map((el: any) => el[data.xKey]);
          variables["arrays_" + i] = JSON.stringify({
            [data.xKey]: array,
          });
        }
        for (var i = 0; i < comparatives.length; i++) {
          let columns = comparatives[i].columns;
          let filters = columns
            .filter((el: any) => el.column_purpose === "filter")
            .map(
              (el: any) =>
                el.column_name + "??" + el.filter_value + "??" + el.filter_type
            );
          variables["columns_like_" + i] =
            filters.length !== 0 ? JSON.stringify(filters) : null;
        }
        setQueryComparativeY({
          query: new_query,
          variables: variables,
        });
      }
    }
  }, [dataQueryComparative, state]);

  useEffect(() => {
    if (dataQueryComparativeY && dataQueryComparativeY !== dataQueryX) {
      let columnX = data.columns.find(
        (el: any) => el.column_purpose === "axisX"
      )[0];
      if (!columnX) {
        columnX = data.columns[0];
      }
      let columnY = data.columns.filter(
        (el: any) => el.column_purpose === "axisY"
      )[0];
      let comparatives_responses = Object.keys(dataQueryComparativeY);
      let merged_data = state.display_data;
      for (var j = 0; j < comparatives_responses.length; j++) {
        let data_ = dataQueryComparativeY[comparatives_responses[j]];
        let format_obj: any = {};
        for (var i = 0; i < data_.length; i++) {
          let key = data_[i][columnX.column_name];
          let value = parseFloat(data_[i][columnY.column_name]);
          if (!Object.keys(format_obj).includes(key)) {
            format_obj[key] = value;
          } else {
            format_obj[key] = format_obj[key] + value;
          }
        }
        let format_data = Object.keys(format_obj).map(function (el) {
          return {
            [columnX.column_name]: el,
            [columnY.column_name + "_" + j]: format_obj[el],
          };
        });
        format_data = format_data.sort(function (a: any, b: any) {
          a = a[columnX.column_name];
          b = b[columnX.column_name];
          return a < b ? -1 : a > b ? 1 : 0;
        });
        merged_data = mergeObjectsByKey(
          format_data,
          merged_data,
          columnX.column_name
        );
      }
      merged_data = completeMissingKeys(merged_data);
      if (JSON.stringify(merged_data) !== JSON.stringify(state.display_data)) {
        setState({ ...state, display_data: merged_data });
        setChartData(merged_data);
        updateComponent({ ...data, data: merged_data });
      }
    }
  }, [dataQueryComparativeY]);

  useEffect(() => {
    const pageInit = () => {
      setXkey(data.xKey);
      setYkey(data.yKey);
      setType(data.type);
      setOnlyView(data.only_view);
      let filters = data.columns.filter(
        (el: any) => el.column_purpose === "filter"
      );
      let table_name = data.columns[0].table_name;
      let table = tables_asoex.filter((el: any) => el.table === table_name)[0];
      if (!table) {
        table = tables_scsdoc.filter((el: any) => el.table === table_name)[0];
      }
      let columns_ = table.columns;
      let formated_columns = columns_.map(function (column: any) {
        return {
          name: column.column_name,
          code: column.column_name,
          type: column.column_type,
        };
      });
      formated_columns = formated_columns.sort(function (a, b) {
        a = a.name;
        b = b.name;
        return a < b ? -1 : a > b ? 1 : 0;
      });
      setColumnsOptions(formated_columns);
      let chartFilters_: any = {};
      for (var i = 0; i < filters.length; i++) {
        let id = "filter-" + (i + 1).toString();
        let filter = filters[i];
        chartFilters_[id] = {
          id: id,
          column_name: {
            code: filter.column_name,
            name: filter.column_name,
            type: formated_columns.find(
              (el: any) => el.name === filter.column_name
            )?.type,
          },
          column_type: getType(filter.column_type),
          filter_type: {
            code: filter.filter_type,
            name: filtersOptions[getType(filter.column_type)].find(
              (el: any) => el.code === filter.filter_type
            ).name,
          },
          filter_value:
            getType(filter.column_type) !== "date"
              ? filter.filter_value
              : new Date(filter.filter_value),
        };
      }
      setChartFilters(chartFilters_);
      // building comparatives
      let comparatives_: any = [];
      if (data.comparative_data?.active) {
        let comparative_data = data.comparative_data.data;
        comparatives_ = Object.keys(data.comparative_data.data).map(function (
          comparative: string
        ) {
          let aux_comparative = comparative_data[comparative];
          let columns_ = aux_comparative.columns;
          let filters_: any = {};
          for (var i = 0; i < columns_?.length; i++) {
            filters_["filter_" + i] = {
              column_name: {
                code: columns_[i].column_name,
                name: columns_[i].column_name,
                type: formated_columns.find(
                  (el: any) => el.name === columns_[i].column_name
                )?.type,
              },
              column_type: columns_[i].column_type,
              filter_type: {
                name: filtersOptions[getType(columns_[i].filter_type)].find(
                  (el: any) => el.code === columns_[i].filter_type
                ).name,
                code: columns_[i].filter_type,
              },
              filter_value:
                getType(columns_[i].filter_type) !== "date"
                  ? columns_[i].filter_value
                  : new Date(columns_[i].filter_value),
              id: "filter_" + i,
            };
          }
          return {
            name: aux_comparative.legend,
            filters: filters_,
          };
        });
      }
      setComparatives(comparatives_);
    };
    pageInit();
  }, [data]);

  const getAxisYDomain = (
    from: number,
    to: number,
    ref: string,
    offset: number
  ) => {
    const refData: any[] = chartData.slice(from, to);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];

    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });

    return [
      ((bottom | 0) - offset).toString(),
      ((top | 0) + offset).toString(),
    ];
  };

  const zoom = () => {
    let { refAreaLeft, refAreaRight } = state;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setState({ ...state, refAreaLeft: "", refAreaRight: "" });
      return;
    }

    let from = chartData.map((el) => el[data.xKey]).indexOf(refAreaLeft);
    let to = chartData.map((el) => el[data.xKey]).indexOf(refAreaRight);
    if (from < 0) from = 0;
    if (to < 0) to = 0;

    // xAxis domain
    if (from > to) {
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
      [from, to] = [to, from];
    }

    if (from !== 0) {
      from = from - 1;
    }
    if (to !== chartData.length) {
      to = to + 1;
    }

    // yAxis domain
    const [bottom, top] = getAxisYDomain(from, to, data.yKey, 1);

    setState({
      ...state,
      refAreaLeft: "",
      refAreaRight: "",
      display_data: chartData.slice(from, to),
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
      active: true,
    });
  };

  const zoomOut = () => {
    setState({
      ...state,
      display_data: chartData,
      refAreaLeft: "",
      refAreaRight: "",
      left: "dataMin",
      right: "dataMax",
      top: "dataMax+1",
      bottom: "dataMin",
      active: false,
    });
  };

  const handleChangeOnlyView = (value: boolean) => {
    setOnlyView(value);
    updateComponent({ ...data, only_view: value });
  };

  const CustomizedAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#64748B">
          {payload.value}
        </text>
      </g>
    );
  };

  const getType = (type: string) => {
    if (
      // type.includes("VARCHAR") ||
      // type.includes("ENUM") ||
      // type.includes("SET") ||
      // type.includes("nvarchar") ||
      // type.includes("varchar") ||
      // type.includes("varbinary") ||
      // type.includes("bit") ||
      // type.includes("image") ||
      // type.includes("char") ||
      // type.includes("nchar") ||
      // type.includes("text") ||
      // type.includes("BOOLEAN") ||
      type.includes("DATETIME") ||
      type.includes("DATE") ||
      type.includes("datetime") ||
      type.includes("timestamp") ||
      type.includes("date")
    ) {
      return "date";
    }
    if (
      type.includes("INT") ||
      type.includes("int") ||
      type.includes("FLOAT") ||
      type.includes("decimal")
    ) {
      return "number";
    }
    return "text";
  };

  const updateChartFilters = () => {
    let current_columns = data.columns.filter(
      (el: any) => el.column_purpose !== "filter"
    );
    let table_name = current_columns[0].table_name;
    for (var i = 0; i < Object.values(chartFilters).length; i++) {
      let filter: any = Object.values(chartFilters)[i];
      current_columns.push({
        table_name: table_name,
        column_name: filter.column_name.name,
        column_type: filter.column_type,
        column_purpose: "filter",
        filter_type: filter.filter_type.code,
        filter_value: filter.filter_value,
        n_ranges: 0,
      });
    }
    let filters = current_columns
      .filter((el: any) => el.column_purpose === "filter")
      .map(
        (el: any) =>
          el.column_name + "??" + el.filter_value + "??" + el.filter_type
      );
    let comparative_data = {
      active: false,
      data: {},
    };
    if (comparatives.length > 0) {
      for (var j = 0; j < comparatives.length; j++) {
        let comparative_columns = [];
        for (
          var i = 0;
          i < Object.values(comparatives[j].filters).length;
          i++
        ) {
          let filter: any = Object.values(comparatives[j].filters)[i];
          comparative_columns.push({
            table_name: table_name,
            column_name: filter.column_name.name,
            column_type: filter.column_type,
            column_purpose: "filter",
            filter_type: filter.filter_type.code,
            filter_value: filter.filter_value,
          });
        }
        let data_ = {
          ...comparative_data.data,
          ["comparative-" + j]: {
            legend: comparatives[j].name,
            columns: comparative_columns,
          },
        };
        comparative_data = {
          ...comparative_data,
          active: true,
          data: data_,
        };
      }
    }
    setVariablesX({
      ...variablesX,
      filters: filters.length !== 0 ? JSON.stringify(filters) : null,
    });
    updateComponent(
      {
        ...data,
        columns: current_columns,
        data: null,
        comparative_data: comparative_data,
        legend: legend,
      },
      JSON.stringify(data.comparative_data) !== JSON.stringify(comparative_data)
    );
    setEditionShowModal(false);
  };

  const onPage = (event: any) => {
    if (event.rows !== data.paginator) {
      updateComponent({ ...data, paginator: event.rows });
    }
    setlazyState(event);
  };

  const bodyTemplate = (rowData: any, el: string) => {
    return formatWithSeparators(rowData[el]);
  };

  return (
    <div className="CCChart__container" style={{ userSelect: "none" }}>
      <div className="CCTable__title">
        <h1>{data.label}</h1>
        <i
          className="pi pi-search"
          style={{
            color: "#8A99AF",
            cursor: "pointer",
            marginLeft: "20px",
            fontSize: "18px",
            marginTop: "-10px",
          }}
          onClick={() => handleChangeOnlyView(!onlyView)}
        ></i>
      </div>
      <div className="CCChart__card">
        {(loadingQueryX ||
          loadingQueryY ||
          loadingQueryComparative ||
          loadingQueryComparativeY) && (
          <div className="CCChart__loader">
            <img src={loaderGifCC}></img>
          </div>
        )}
        <Row className="justify-content-end">
          {state.active && (
            <div
              className="CCChart__card-button"
              onClick={zoomOut}
              style={{ marginRight: !onlyView ? "10px" : "30px" }}
            >
              <label>Zoom Out</label>
              <i
                className="pi pi-search-minus"
                style={{
                  color: "#8A99AF",
                  cursor: "pointer",
                  marginLeft: "10px",
                  fontSize: "18px",
                }}
              ></i>
            </div>
          )}
          {!onlyView && (
            <Row style={{ display: "inline-block", width: "auto" }}>
              <Col style={{ display: "flex", alignItems: "center" }}>
                <Button
                  style={{
                    marginRight: "10px",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#3154A1",
                  }}
                  type="button"
                  icon="pi pi-table"
                  rounded
                  onClick={() => {
                    setShowTable(!showTable);
                    updateComponent({ ...data, show_table: !showTable });
                  }}
                />
                <Button
                  style={{
                    marginRight: "10px",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#3154A1",
                  }}
                  type="button"
                  icon="pi pi-cog"
                  rounded
                  onClick={() => setEditionShowModal(!showEditionModal)}
                />
                <Button
                  style={{ marginRight: "30px", width: "40px", height: "40px" }}
                  type="button"
                  icon="pi pi-times"
                  severity="danger"
                  rounded
                  onClick={() => setShowModal(true)}
                />
              </Col>
            </Row>
          )}
        </Row>
        <ComposedChart
          width={600}
          height={300}
          data={state.display_data}
          margin={{
            top: 5,
            right: 30,
            left: 40,
            bottom: 5,
          }}
          onMouseDown={(e: any) => {
            if (e) {
              setState({ ...state, refAreaLeft: e.activeLabel });
            }
          }}
          onMouseMove={(e: any) =>
            state.refAreaLeft &&
            setState({ ...state, refAreaRight: e.activeLabel })
          }
          // eslint-disable-next-line react/jsx-no-bind
          onMouseUp={zoom}
        >
          {data.comparative_data?.active && <Legend verticalAlign="top" />}
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          <XAxis dataKey={xkey} allowDataOverflow tick={<CustomizedAxisTick />}>
            <Label value={xkey} offset={5} position="bottom" />
          </XAxis>
          <YAxis
            tickFormatter={(e) => formatWithSeparators(e)}
            label={{ value: ykey, angle: -90, position: "left" }}
            domain={[state.bottom, state.top]}
            allowDataOverflow
            yAxisId="1"
          />
          <Tooltip content={<CustomTooltip />} />
          {type === "line" && (
            <>
              <Line
                type="monotone"
                name={data.legend}
                dataKey={ykey}
                stroke="#3154A1"
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
                strokeWidth={2}
                yAxisId="1"
              />
              {data.comparative_data?.active
                ? Object.values(data.comparative_data.data).map(function (
                    comparative_data: any,
                    index: number
                  ) {
                    return (
                      <Line
                        name={comparative_data.legend}
                        key={"Line-" + index}
                        type="monotone"
                        dataKey={data.yKey + "_" + index}
                        stroke={colors[index]}
                        dot={{ r: 2 }}
                        activeDot={{ r: 6 }}
                        strokeWidth={2}
                        yAxisId="1"
                      />
                    );
                  })
                : null}
            </>
          )}
          {type === "bar" && (
            <>
              <Bar
                dataKey={ykey}
                name={data.legend}
                barSize={20}
                fill="#3154A1"
                yAxisId="1"
              />
              {data.comparative_data?.active
                ? Object.values(data.comparative_data.data).map(function (
                    comparative_data: any,
                    index: number
                  ) {
                    return (
                      <Bar
                        name={comparative_data.legend}
                        key={"Bar-" + index}
                        dataKey={data.yKey + "_" + index}
                        barSize={20}
                        fill={colors[index]}
                        yAxisId="1"
                      />
                    );
                  })
                : null}
            </>
          )}
          {type === "area" && (
            <>
              <Area
                yAxisId="1"
                type="monotone"
                name={data.legend}
                dataKey={ykey}
                fill="#3154A1"
                stroke="#3154A1"
              />
              {data.comparative_data?.active
                ? Object.values(data.comparative_data.data).map(function (
                    comparative_data: any,
                    index: number
                  ) {
                    return (
                      <Area
                        name={comparative_data.legend}
                        type="monotone"
                        dataKey={data.yKey + "_" + index}
                        fill={colors[index]}
                        stroke={colors[index]}
                        yAxisId="1"
                      />
                    );
                  })
                : null}
            </>
          )}
          {state.refAreaLeft && state.refAreaRight ? (
            <ReferenceArea
              yAxisId="1"
              x1={state.refAreaLeft}
              x2={state.refAreaRight}
              strokeOpacity={0.3}
            />
          ) : null}
        </ComposedChart>
        {showTable &&
          !(
            loadingQueryX ||
            loadingQueryY ||
            loadingQueryComparative ||
            loadingQueryComparativeY
          ) && (
            <div style={{ marginTop: "50px" }}>
              <DataTable
                value={state.display_data}
                paginator
                rows={lazyState.rows}
                first={lazyState.first}
                rowsPerPageOptions={[5, 10, 25, 50]}
                dataKey={dataTable.column_x}
                filters={filters}
                filterDisplay="row"
                globalFilterFields={[dataTable.column_x, dataTable.column_y]}
                onPage={onPage}
              >
                <Column
                  field={dataTable.column_x}
                  header={dataTable.column_x}
                  sortable
                  body={(el_: any) => bodyTemplate(el_, dataTable.column_x)}
                  filter
                  filterPlaceholder="Search"
                ></Column>
                <Column
                  field={dataTable.column_y}
                  header={
                    data.legend !== dataTable.column_y
                      ? dataTable.column_y + "_" + data.legend
                      : dataTable.column_y
                  }
                  body={(el_: any) => bodyTemplate(el_, dataTable.column_y)}
                  filter
                  filterPlaceholder="Search"
                  sortable
                ></Column>
                {dataTable.comparative_columns.map(function (
                  el: string,
                  index: number
                ) {
                  let header = "";
                  let header_: any = Object.values(data.comparative_data.data)[
                    index
                  ];
                  if (header_) {
                    header = header_.legend;
                  }
                  return (
                    <Column
                      key={el}
                      field={el}
                      header={dataTable.column_y + "_" + header}
                      body={(el_: any) => bodyTemplate(el_, el)}
                      filter
                      filterPlaceholder="Search"
                      sortable
                    ></Column>
                  );
                })}
              </DataTable>
            </div>
          )}
      </div>
      <Modal isOpen={showModal} style={customStyles}>
        <div className="CCChart__action-modal">
          <Row style={{ marginBottom: "20px" }}>
            <Col>
              <label>Are you sure to delete the chart?</label>
              <h2>{data.label}</h2>
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "center" }}>
              <button
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
            </Col>
            <Col style={{ textAlign: "center" }}>
              <button onClick={deleteChart}>Accept</button>
            </Col>
          </Row>
        </div>
      </Modal>
      <Modal isOpen={showEditionModal} style={customStyles}>
        <div className="CCChart__action-modal">
          <label>Legend</label>
          <div>
            <input
              type="text"
              style={{ width: "50%", marginLeft: "10px" }}
              value={legend}
              onChange={(e) => setLegend(e.target.value)}
              placeholder=""
            />
          </div>
          <label>Current filters</label>
          {Object.values(chartFilters).map(function (filter: any) {
            let column_type = "text";
            if (filter.column_type !== column_type)
              column_type = filter.column_type;
            return (
              <Row className="align-items-center" key={filter.id}>
                <Col>
                  <Dropdown
                    value={chartFilters[filter.id]?.column_name || null}
                    onChange={(e) => {
                      if (columnsOptions) {
                        setChartFilters({
                          ...chartFilters,
                          [filter.id]: {
                            ...chartFilters[filter.id],
                            column_name: e.value,
                            column_type: getType(
                              columnsOptions.find(
                                (el: any) => el.name === e.value.name
                              )?.type || ""
                            ),
                          },
                        });
                      }
                    }}
                    options={columnsOptions || []}
                    optionLabel="name"
                    className="newComponentModal__dropdown"
                    placeholder="Columns"
                  />
                </Col>
                <Col>
                  <Dropdown
                    value={chartFilters[filter.id]?.filter_type || null}
                    onChange={(e) =>
                      setChartFilters({
                        ...chartFilters,
                        [filter.id]: {
                          ...chartFilters[filter.id],
                          filter_type: e.value,
                        },
                      })
                    }
                    options={filtersOptions[column_type]}
                    optionLabel="name"
                    className="newComponentModal__dropdown"
                    placeholder="Filters"
                  />
                </Col>
                <Col>
                  {column_type !== "date" ? (
                    <input
                      type={column_type === "text" ? "text" : "number"}
                      value={chartFilters[filter.id]?.filter_value}
                      onChange={(e) =>
                        setChartFilters({
                          ...chartFilters,
                          [filter.id]: {
                            ...chartFilters[filter.id],
                            filter_value: e.target.value,
                          },
                        })
                      }
                      placeholder="Value"
                    />
                  ) : (
                    <Calendar
                      hideOnDateTimeSelect={true}
                      placeholder="dd/mm/yyyy"
                      dateFormat="dd/mm/yy"
                      value={chartFilters[filter.id].filter_value}
                      onChange={(e: any) => {
                        setChartFilters({
                          ...chartFilters,
                          [filter.id]: {
                            ...chartFilters[filter.id],
                            filter_value: e.value.toISOString(),
                          },
                        });
                      }}
                    />
                  )}
                </Col>
                <Col>
                  <i
                    className="pi pi-trash"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      let chartFilters_ = { ...chartFilters };
                      delete chartFilters_[filter.id];
                      setChartFilters(chartFilters_);
                    }}
                  ></i>
                </Col>
              </Row>
            );
          })}
          <div>
            <button
              style={{
                backgroundColor: "#3154A1",
              }}
              onClick={() => {
                if (Object.values(chartFilters).length === 0) {
                  setChartFilters({
                    ...chartFilters,
                    ["filter-" +
                    (Object.keys(chartFilters).length + 1).toString()]: {
                      id:
                        "filter-" +
                        (Object.keys(chartFilters).length + 1).toString(),
                      column_name: "",
                      column_type: "",
                      filter_type: "",
                      filter_value: "",
                    },
                  });
                } else {
                  if (
                    Object.values(chartFilters).every((obj: any) =>
                      Object.values(obj).every((value) => !!value)
                    )
                  ) {
                    setChartFilters({
                      ...chartFilters,
                      ["filter-" +
                      (Object.keys(chartFilters).length + 1).toString()]: {
                        id:
                          "filter-" +
                          (Object.keys(chartFilters).length + 1).toString(),
                        column_name: "",
                        column_type: "",
                        filter_type: "",
                        filter_value: "",
                      },
                    });
                  }
                }
              }}
            >
              <i className="pi pi-plus" style={{ marginRight: "10px" }}></i>
              Add filter
            </button>
          </div>
          <div>
            {comparatives.map(function (comparative: any, index: number) {
              return (
                <div
                  className="newComponentModal__comparative-container"
                  key={"comparative-" + index}
                >
                  <Row
                    className="justify-content-center"
                    style={{ marginBottom: "20px" }}
                  >
                    <Col
                      xs={10}
                      lg={10}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        type="text"
                        value={comparative.name}
                        onChange={(e) => {
                          let comparatives_ = [...comparatives];
                          let comparative_ = { ...comparative };
                          comparative_.name = e.target.value;
                          comparatives_[index] = comparative_;
                          setComparatives(comparatives_);
                        }}
                        placeholder="Legend"
                        style={{ margin: 0 }}
                      />
                    </Col>
                    <Col
                      xs={2}
                      lg={2}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <i
                        className="pi pi-trash"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          let comparatives_ = [...comparatives];
                          comparatives_.splice(index, 1);
                          setComparatives(comparatives_);
                        }}
                      ></i>
                    </Col>
                  </Row>
                  {Object.values(comparative.filters).map(function (
                    filter: any
                  ) {
                    let column_type = "text";
                    if (filter.column_type !== column_type)
                      column_type = filter.column_type;
                    return (
                      <Row className="align-items-center" key={filter.id}>
                        <Col>
                          <Dropdown
                            value={
                              comparatives[index].filters[filter.id]
                                .column_name || null
                            }
                            onChange={(e) => {
                              if (columnsOptions) {
                                let comparatives_ = [...comparatives];
                                let comparative_ = { ...comparative };
                                let filters_ = {
                                  ...comparatives[index].filters,
                                  [filter.id]: {
                                    ...comparatives[index].filters[filter.id],
                                    column_name: e.value,
                                    column_type: getType(
                                      columnsOptions.find(
                                        (el) => el.name === e.value.name
                                      )?.type || ""
                                    ),
                                  },
                                };
                                comparative_.filters = filters_;
                                comparatives_[index] = comparative_;
                                setComparatives(comparatives_);
                              }
                            }}
                            options={columnsOptions || []}
                            optionLabel="name"
                            className="newComponentModal__dropdown"
                            placeholder="Columns"
                          />
                        </Col>
                        <Col>
                          <Dropdown
                            value={
                              comparatives[index].filters[filter.id]
                                .filter_type || null
                            }
                            onChange={(e) => {
                              let comparatives_ = [...comparatives];
                              let comparative_ = { ...comparative };
                              let filters_ = {
                                ...comparatives[index].filters,
                                [filter.id]: {
                                  ...comparatives[index].filters[filter.id],
                                  filter_type: e.value,
                                },
                              };
                              comparative_.filters = filters_;
                              comparatives_[index] = comparative_;
                              setComparatives(comparatives_);
                            }}
                            options={filtersOptions[column_type]}
                            optionLabel="name"
                            className="newComponentModal__dropdown"
                            placeholder="Filters"
                          />
                        </Col>
                        <Col>
                          {column_type !== "date" ? (
                            <input
                              type={column_type === "text" ? "text" : "number"}
                              value={
                                comparatives[index].filters[filter.id]
                                  .filter_value
                              }
                              onChange={(e) => {
                                let comparatives_ = [...comparatives];
                                let comparative_ = { ...comparative };
                                let filters_ = {
                                  ...comparatives[index].filters,
                                  [filter.id]: {
                                    ...comparatives[index].filters[filter.id],
                                    filter_value: e.target.value,
                                  },
                                };
                                comparative_.filters = filters_;
                                comparatives_[index] = comparative_;
                                setComparatives(comparatives_);
                              }}
                              placeholder="Value"
                            />
                          ) : (
                            <Calendar
                              hideOnDateTimeSelect={true}
                              placeholder="dd/mm/yyyy"
                              dateFormat="dd/mm/yy"
                              value={
                                comparatives[index].filters[filter.id]
                                  .filter_value
                              }
                              onChange={(e: any) => {
                                let comparatives_ = [...comparatives];
                                let comparative_ = { ...comparative };
                                let filters_ = {
                                  ...comparatives[index].filters,
                                  [filter.id]: {
                                    ...comparatives[index].filters[filter.id],
                                    filter_value: e.value.toISOString(),
                                  },
                                };
                                comparative_.filters = filters_;
                                comparatives_[index] = comparative_;
                                setComparatives(comparatives_);
                              }}
                            />
                          )}
                        </Col>
                        {Object.values(comparative.filters).length > 1 && (
                          <Col>
                            <i
                              className="pi pi-trash"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                let comparatives_ = [...comparatives];
                                let comparative_ = { ...comparative };
                                let filters_ = {
                                  ...comparatives[index].filters,
                                };
                                delete filters_[filter.id];
                                comparative_.filters = filters_;
                                comparatives_[index] = comparative_;
                                setComparatives(comparatives_);
                              }}
                            ></i>
                          </Col>
                        )}
                      </Row>
                    );
                  })}
                  <button
                    onClick={() => {
                      if (Object.values(comparative.filters).length === 0) {
                        let comparatives_ = [...comparatives];
                        let comparative_ = { ...comparative };
                        let id = "filter-" + Date.now();
                        comparative_.filters = {
                          ...comparative.filters,
                          [id]: {
                            id: id,
                            column_name: "",
                            column_type: "",
                            filter_type: "",
                            filter_value: "",
                          },
                        };
                        comparatives_[index] = comparative_;
                        setComparatives(comparatives_);
                      } else {
                        if (
                          Object.values(comparative.filters).every((obj: any) =>
                            Object.values(obj).every((value) => !!value)
                          )
                        ) {
                          let comparatives_ = [...comparatives];
                          let comparative_ = { ...comparative };
                          let id = "filter-" + Date.now();
                          comparative_.filters = {
                            ...comparative.filters,
                            [id]: {
                              id: id,
                              column_name: "",
                              column_type: "",
                              filter_type: "",
                              filter_value: "",
                            },
                          };
                          comparatives_[index] = comparative_;
                          setComparatives(comparatives_);
                        }
                      }
                    }}
                  >
                    <i
                      className="pi pi-plus"
                      style={{ marginRight: "10px" }}
                    ></i>
                    Add comparative filters
                  </button>
                </div>
              );
            })}
            <button
              style={{
                marginTop: "10px",
                marginBottom: "30px",
              }}
              onClick={() =>
                setComparatives([
                  ...comparatives,
                  {
                    name: "",
                    filters: {
                      "filter-0": {
                        id: "filter-0",
                        column_name: "",
                        column_type: "",
                        filter_type: "",
                        filter_value: "",
                      },
                    },
                  },
                ])
              }
            >
              <i className="pi pi-plus" style={{ marginRight: "10px" }}></i>
              Add comparative
            </button>
          </div>
          <Row className="justify-content-center">
            <Col style={{ textAlign: "center" }}>
              <button
                onClick={() => {
                  let filters = data.columns.filter(
                    (el: any) => el.column_purpose === "filter"
                  );
                  let chartFilters_: any = {};
                  for (var i = 0; i < filters.length; i++) {
                    let id = "filter-" + (i + 1).toString();
                    let filter = filters[i];
                    chartFilters_[id] = {
                      id: id,
                      column_name: {
                        code: filter.column_name,
                        name: filter.column_name,
                        type: columnsOptions?.find(
                          (el: any) => el.name === filter.column_name
                        )?.type,
                      },
                      column_type: getType(filter.column_type),
                      filter_type: {
                        code: filter.filter_type,
                        name: filtersOptions[getType(filter.column_type)].find(
                          (el: any) => el.code === filter.filter_type
                        ).name,
                      },
                      filter_value:
                        getType(filter.column_type) !== "date"
                          ? filter.filter_value
                          : new Date(filter.filter_value),
                    };
                  }
                  setChartFilters(chartFilters_);
                  setEditionShowModal(false);
                }}
              >
                Cancel
              </button>
            </Col>
            <Col style={{ textAlign: "center" }}>
              <button
                disabled={
                  !(
                    Object.values(chartFilters).every((obj: any) =>
                      Object.values(obj).every((value) => !!value)
                    ) &&
                    Object.values(comparatives).every((obj: any) =>
                      Object.values(obj).every((value) => !!value)
                    )
                  )
                }
                onClick={updateChartFilters}
              >
                Accept
              </button>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
}
