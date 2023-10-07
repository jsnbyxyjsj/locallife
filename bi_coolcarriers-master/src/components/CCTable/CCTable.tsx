import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../../libs/contextLib";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { jsPDF } from "jspdf";
import autoTable, { CellInput, RowInput } from "jspdf-autotable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";
import Modal from "react-modal";
import { Row, Col } from "react-bootstrap";
import { Tooltip } from "primereact/tooltip";
import { SpeedDial } from "primereact/speeddial";
import { tables_asoex, tables_scsdoc } from "../../libs/tablesReferences";
import { Calendar } from "primereact/calendar";
import { formatWithSeparators } from "../../libs/functions";

// === Images ===
import excel100 from "../../assets/images/icon-excel-100.svg";
import excel1000 from "../../assets/images/icon-excel-1000.svg";
import excel5000 from "../../assets/images/icon-excel-5000.svg";
import pdf100 from "../../assets/images/icon-pdf-100.svg";
import pdf1000 from "../../assets/images/icon-pdf-1000.svg";
import pdf5000 from "../../assets/images/icon-pdf-5000.svg";

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

// var timerId: any = null;
var globalTimerId: any = null;
var waitingTime = 1000;

Modal.setAppElement("body");
export default function BasicFilterDemo({ data }: any) {
  const {
    userConfiguration,
    setUserConfiguration,
    currentSection,
    currentPage,
  } = useAppContext();
  const [totalRecords, setTotalRecords] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [onlyView, setOnlyView] = useState(true);
  interface Filters {
    global: {
      value: string | null;
      matchMode: FilterMatchMode;
    };
    [key: string]: {
      value: string | null;
      matchMode: FilterMatchMode;
    };
  }
  const [lazyState, setlazyState] = useState<{
    first: number;
    rows: number;
    page: number;
    sortField: string | null;
    sortOrder: number | null;
    filters: Filters;
    onPage: Boolean | null;
  }>({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    },
    onPage: false,
  });
  const [columns, setColumns] = useState<string[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [globalFilterBlock, setGlobalFilterBlock] = useState<boolean>(false);
  const [selectedColumns, setSelectedColumns] = useState<any>(null);
  const [totalColumns, setTotalColumns] = useState<any[]>([]);
  const [columnsTypes, setColumnsTypes] = useState<any>(null);

  const dt = useRef(null);

  const [query, setQuery] = useState(data.query);
  const [variables, setVariables] = useState(data.variables);
  const {
    loading: loadingQuery,
    // error: errorQuery,
    data: dataQuery,
  } = useQuery(gql(query), {
    variables: variables,
  });

  const [sumQuery, setSumQuery] = useState({
    query: data.query,
    variables: data.variables,
  });
  const {
    // loading: loadingSumQuery,
    // error: errorQuery,
    data: dataSumQuery,
  } = useQuery(gql(sumQuery.query), {
    variables: sumQuery.variables,
  });

  const [exportQuery] = useLazyQuery(gql(query));

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

  const updateComponent = async (data_: any) => {
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
      updateConfiguration({
        variables: {
          platform_configurations_id:
            userConfiguration_.platform_configurations_id,
          dashboard_configuration: JSON.stringify(userConfiguration_),
        },
      });
    }
  };

  useEffect(() => {
    const pageInit = () => {
      let order = JSON.parse(data.variables.order.split("'").join('"'))[0];
      setlazyState({
        ...lazyState,
        first: data.variables.offset,
        rows: data.variables.limit,
        sortField: order.column,
        sortOrder: order.order === "DESC" ? -1 : 1,
        filters: data.filters,
      });
      if (data.filters.global.value) {
        setGlobalFilterValue(data.filters.global.value);
      }
      let active_columns = data.active_columns.map(function (el: string) {
        return { name: el, code: el };
      });
      let columns_ = data.columns.map(function (el: string) {
        return { name: el, code: el };
      });
      let table_name = data.table_name;
      let table = tables_asoex.filter((el: any) => el.table === table_name)[0];
      if (!table) {
        table = tables_scsdoc.filter((el: any) => el.table === table_name)[0];
      }
      if (table) {
        let types: any = {};
        for (let i = 0; i < table.columns.length; i++) {
          types[table.columns[i].column_name] = table.columns[i];
        }
        // build sum query
        let number_columns = data.active_columns.filter(function (
          column: string
        ) {
          return getType(column, types) === "numeric";
        });
        if (number_columns.length > 0) {
          let columns_query = number_columns
            .map(
              (el: string) =>
                `${el}:sum_column(table_name: "${table_name}", sum_column: "${el}", filters: $filters)`
            )
            .join("\n");
          let number_query = `query sum_column($filters: JSON){
            ${columns_query}
          }`;
          let number_variables = { filters: data.variables.columns_like };
          setSumQuery({ query: number_query, variables: number_variables });
        }
        setColumnsTypes(types);
        setSelectedColumns(active_columns);
        setColumns(data.active_columns);
        setTotalColumns(columns_);
        setOnlyView(data.only_view);
      } else {
        deleteTable();
      }
    };
    pageInit();
  }, []);

  useEffect(() => {
    if (dataQuery) {
      let table_name = data.table_name;
      let table = tables_asoex.filter((el: any) => el.table === table_name)[0];
      if (!table) {
        table = tables_scsdoc.filter((el: any) => el.table === table_name)[0];
      }
      if (table) {
        let count_rows = dataQuery.count_rows;
        let columns_ = data.columns.map(function (el: string) {
          return { name: el, code: el };
        });
        let active_columns = data.active_columns.map(function (el: string) {
          return { name: el, code: el };
        });
        if (selectedColumns === null || totalColumns !== columns_) {
          setSelectedColumns(active_columns);
          setColumns(data.active_columns);
        } else {
          let selectedColumns_ = selectedColumns.map((el: any) => el.name);
          setColumns(selectedColumns_);
        }
        setTotalColumns(columns_);
        setTotalRecords(count_rows);
      }
    }
  }, [dataQuery]);

  useEffect(() => {
    if (selectedColumns) {
      let selectedColumns_ = selectedColumns.map((el: any) => el.name);
      setColumns(selectedColumns_);
    }
  }, [selectedColumns]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    if (globalTimerId !== null) {
      clearTimeout(globalTimerId);
    }
    globalTimerId = setTimeout(() => {
      if (!value) {
        let filters_: any = {
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        };
        for (let i = 0; i < data.columns.length; i++) {
          if (globalFilterBlock) {
            filters_[data.columns[i]] = {
              operator: FilterOperator.AND,
              constraints: [
                { value: null, matchMode: FilterMatchMode.CONTAINS },
              ],
            };
          } else {
            if (!Object.keys(filters_).includes(data.columns[i])) {
              filters_[data.columns[i]] = {
                operator: FilterOperator.AND,
                constraints: [
                  { value: null, matchMode: FilterMatchMode.CONTAINS },
                ],
              };
            }
          }
        }
        setGlobalFilterBlock(false);
        let variables_ = {
          ...variables,
          columns_like: null,
          filters: null,
          offset: 0,
        };
        setlazyState({ ...lazyState, filters: filters_ });
        setVariables(variables_);
        // build sum query
        let number_columns = selectedColumns
          .map((el: any) => el.name)
          .filter(function (column: string) {
            return getType(column) === "numeric";
          });
        if (number_columns.length > 0) {
          let columns_query = number_columns
            .map(
              (el: string) =>
                `${el}:sum_column(table_name: "${data.table_name}", sum_column: "${el}", filters: $filters)`
            )
            .join("\n");
          let number_query = `query sum_column($filters: JSON){${columns_query}}`;
          let number_variables = { filters: null };
          setSumQuery({ query: number_query, variables: number_variables });
        }
        updateComponent({ ...data, variables: variables_, filters: filters_ });
      } else {
        let filters_: any = { ...lazyState.filters };
        if ("value" in filters_["global"]) {
          filters_["global"].value = value;
        }
        for (let i = 0; i < data.columns.length; i++) {
          filters_[data.columns[i]] = {
            operator: FilterOperator.AND,
            constraints: [
              { value: value, matchMode: FilterMatchMode.CONTAINS },
            ],
          };
        }
        if (!globalFilterBlock) {
          setGlobalFilterBlock(true);
        } else {
          setGlobalFilterBlock(false);
        }
        let columns_like;
        let counter_filters = null;
        let filters = Object.keys(filters_)
          .map(function (el) {
            return { ...filters_[el], key: el };
          })
          .filter(function (el_: any) {
            if (el_.constraints) {
              return el_.constraints[0].value;
            }
            return el_.value;
          });
        if (filters?.length > 0) {
          if (filters.map((el) => el.key).includes("global")) {
            let global_value = filters.find((el) => el.key === "global")?.value;
            columns_like = selectedColumns
              .map((el_: any) => el_.name)
              .map(function (el: string) {
                return el + "??" + global_value + "??contains??or";
              });
            columns_like.push("global");
            counter_filters = JSON.stringify(columns_like);
            columns_like = JSON.stringify(columns_like);
          } else {
            columns_like = [];
            for (var i = 0; i < filters.length; i++) {
              for (var j = 0; j < filters[i].constraints.length; j++) {
                let el = filters[i].constraints[j];
                let type = getType(filters[i].key);
                let value = el.value;
                if (type === "date") {
                  value = new Date(value).toISOString();
                  value = value.split("T")[0] + "T00:00:00.000Z";
                }
                columns_like.push(
                  filters[i].key +
                    "??" +
                    value +
                    "??" +
                    el.matchMode +
                    "??" +
                    filters[i].operator
                );
              }
            }
            // columns_like = filters.map(function (el) {
            //   return el.key + "??" + el.value + "??" + el.matchMode;
            // });
            counter_filters = JSON.stringify(columns_like);
            columns_like = JSON.stringify(columns_like);
          }
        }
        let variables_ = {
          ...variables,
          columns_like: columns_like,
          filters: counter_filters,
          offset: 0,
        };
        // build sum query
        let number_columns = selectedColumns
          .map((el: any) => el.name)
          .filter(function (column: string) {
            return getType(column) === "numeric";
          });
        if (number_columns.length > 0) {
          let columns_query = number_columns
            .map(
              (el: string) =>
                `${el}:sum_column(table_name: "${data.table_name}", sum_column: "${el}", filters: $filters)`
            )
            .join("\n");
          let number_query = `query sum_column($filters: JSON){${columns_query}}`;
          let number_variables = { filters: columns_like };
          setSumQuery({ query: number_query, variables: number_variables });
        }
        setlazyState({ ...lazyState, filters: filters_ });
        setVariables(variables_);
        updateComponent({ ...data, variables: variables_, filters: filters_ });
        globalTimerId = null;
      }
    }, waitingTime);
  };

  const getType = (column_name: string, columnsTypes_ = columnsTypes) => {
    let type = columnsTypes_[column_name].column_type;
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
      return "numeric";
    }
    if (type.includes("BOOLEAN")) {
      return "boolean";
    }
    return null;
  };

  const exportPdf = (data: any) => {
    let head = [selectedColumns.map((el: any) => el.name)];
    let body: RowInput[] = data.map(
      (el: any) => Object.values(el) as CellInput[]
    );
    let doc = new jsPDF();
    if (head[0].length >= 5) {
      doc = new jsPDF("l");
    }
    autoTable(doc, {
      head,
      body,
      theme: "grid",
      horizontalPageBreak: true,
      headStyles: {
        fillColor: "#3154A1",
      },
    });
    doc.save("coolcarriers_data.pdf");
  };

  const exportExcel = (data: any) => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      var wscols = Object.keys(data[0]).map(function (el: any) {
        return { width: el.length * 1.5 };
      });
      worksheet["!cols"] = wscols;
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "coolcarriers_data");
    });
  };

  const saveAsExcelFile = (buffer: any, fileName: string) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const updateColumns = (value: any) => {
    if (value.length === 0) {
      value = [{ name: columns[0], code: columns[0] }];
    }
    // Clean filters
    let filters = Object.keys(lazyState.filters)
      .map(function (el) {
        return { ...lazyState.filters[el], key: el };
      })
      .filter(function (el_: any) {
        if (el_.constraints) {
          return el_.constraints[0].value;
        }
        return el_.value;
      });
    filters = filters.filter((el) =>
      value.map((el_: any) => el_.name).includes(el.key)
    );
    onFilter(lazyState, filters);
    let new_columns = value.map((el: any) => el.name);
    let data_ = { ...data };
    data_.active_columns = new_columns;
    let new_query =
      `
      query list_` +
      data.table_name +
      `($limit: Int, $offset: Int, $order: JSON, $columns_like: JSON, $filters: JSON){
        list_` +
      data.table_name +
      `(limit: $limit, offset: $offset, order: $order, columns_like: $columns_like){
            ` +
      new_columns.join(",") +
      `
        }
        count_rows(table_name: "` +
      data.table_name +
      `", filters: $filters)
      }
      `;
    // build sum query
    let number_columns = value
      .map((el: any) => el.name)
      .filter(function (column: string) {
        return getType(column) === "numeric";
      });
    if (number_columns.length > 0) {
      let columns_query = number_columns
        .map(
          (el: string) =>
            `${el}:sum_column(table_name: "${data.table_name}", sum_column: "${el}", filters: $filters)`
        )
        .join("\n");
      let number_query = `query sum_column($filters: JSON){
          ${columns_query}
        }`;
      setSumQuery({ query: number_query, variables: sumQuery.variables });
    }
    setQuery(new_query);
    data_.query = new_query;
    data_.data = null;
    updateComponent(data_);
    setSelectedColumns(value);
  };

  const onPage = (event: any) => {
    let variables_ = {
      ...variables,
      limit: event.rows,
      offset: event.first,
    };
    setlazyState(event);
    setVariables(variables_);
    updateComponent({ ...data, variables: variables_ });
  };

  const onSort = (event: any) => {
    event["first"] = 0;
    let order = variables.order;
    if (event.sortField && event.sortOrder) {
      order = JSON.stringify([
        {
          column: event.sortField,
          order: event.sortOrder > 0 ? "ASC" : "DESC",
        },
      ]);
    }
    let variables_ = {
      ...variables,
      order: order,
      offset: event.first,
    };
    setlazyState(event);
    setVariables(variables_);
    updateComponent({ ...data, variables: variables_ });
  };

  const onFilter = (event: any, current_filters: any = null) => {
    event["first"] = 0;
    let columns_like = null;
    let counter_filters = null;
    let filters = current_filters;
    if (filters === null) {
      filters = Object.keys(event.filters)
        .map(function (el) {
          return { ...event.filters[el], key: el };
        })
        .filter(function (el_: any) {
          if (el_.constraints) {
            return el_.constraints[0].value;
          }
          return el_.value;
        });
    }
    if (filters?.length > 0) {
      if (filters.map((el: any) => el.key).includes("global")) {
        let global_value = filters.find(
          (el: any) => el.key === "global"
        )?.value;
        columns_like = selectedColumns
          .map((el_: any) => el_.name)
          .map(function (el: string) {
            return el + "??" + global_value + "??contains??or";
          });
        columns_like.push("global");
        counter_filters = JSON.stringify(columns_like);
        columns_like = JSON.stringify(columns_like);
      } else {
        columns_like = [];
        for (var i = 0; i < filters.length; i++) {
          for (var j = 0; j < filters[i].constraints.length; j++) {
            let el = filters[i].constraints[j];
            let type = getType(filters[i].key);
            let value = el.value;
            if (type === "date") {
              value = new Date(value).toISOString();
              value = value.split("T")[0] + "T00:00:00.000Z";
            }
            columns_like.push(
              filters[i].key +
                "??" +
                value +
                "??" +
                el.matchMode +
                "??" +
                filters[i].operator
            );
          }
        }
        counter_filters = JSON.stringify(columns_like);
        columns_like = JSON.stringify(columns_like);
      }
    }
    let variables_ = {
      ...variables,
      columns_like: columns_like,
      filters: counter_filters,
      offset: event.first,
    };
    // build sum query
    let number_columns = selectedColumns
      .map((el: any) => el.name)
      .filter(function (column: string) {
        return getType(column) === "numeric";
      });
    if (number_columns.length > 0) {
      let columns_query = number_columns
        .map(
          (el: string) =>
            `${el}:sum_column(table_name: "${data.table_name}", sum_column: "${el}", filters: $filters)`
        )
        .join("\n");
      let number_query = `query sum_column($filters: JSON){
          ${columns_query}
        }`;
      let number_variables = { filters: columns_like };
      setSumQuery({ query: number_query, variables: number_variables });
    }
    setlazyState(event);
    setVariables(variables_);
    updateComponent({
      ...data,
      variables: variables_,
      filters: event.filters,
    });
  };

  const deleteTable = () => {
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

  const handleChangeOnlyView = (value: boolean) => {
    setOnlyView(value);
    updateComponent({ ...data, only_view: value });
  };

  const removeKey = (array: any, key: string) => {
    return array.map((obj: any) => {
      const newObj = { ...obj };
      delete newObj[key];
      return newObj;
    });
  };
  const exportExcelOptions = [
    {
      label: "Export current table",
      icon: "pi pi-file-excel",
      command: () => {
        let formatted_data = dataQuery ? dataQuery[data.query_name] : [];
        formatted_data = removeKey(formatted_data, "__typename");
        exportExcel(formatted_data);
      },
    },
    {
      label: "Export next 100 rows",
      icon: (
        <img
          alt="Export 100 rows Excel"
          src={excel100}
          style={{ width: "40px" }}
        />
      ),
      command: async () => {
        let variables_ = {
          ...variables,
          limit: 100,
          offset: 0,
        };
        let response = await exportQuery({ variables: variables_ });
        if (response.data[data.query_name]) {
          let formatted_data = removeKey(
            response.data[data.query_name],
            "__typename"
          );
          exportExcel(formatted_data);
        }
      },
    },
    {
      label: "Export next 1000 rows",
      icon: (
        <img
          alt="Export 1000 rows Excel"
          src={excel1000}
          style={{ width: "40px" }}
        />
      ),
      command: async () => {
        let variables_ = {
          ...variables,
          limit: 1000,
          offset: 0,
        };
        let response = await exportQuery({ variables: variables_ });
        if (response.data[data.query_name]) {
          let formatted_data = removeKey(
            response.data[data.query_name],
            "__typename"
          );
          exportExcel(formatted_data);
        }
      },
    },
    {
      label: "Export next 5000 rows",
      icon: (
        <img
          alt="Export 5000 rows Excel"
          src={excel5000}
          style={{ width: "40px" }}
        />
      ),
      command: async () => {
        let variables_ = {
          ...variables,
          limit: 5000,
          offset: 0,
        };
        let response = await exportQuery({ variables: variables_ });
        if (response.data[data.query_name]) {
          let formatted_data = removeKey(
            response.data[data.query_name],
            "__typename"
          );
          exportExcel(formatted_data);
        }
      },
    },
    // {
    //   label: "Export all",
    //   icon: <img alt="Export all rows Excel" />,
    //   command: async () => {
    //     let variables_ = {
    //       ...variables,
    //       limit: null,
    //       offset: 0,
    //     };
    //     let response = await exportQuery({ variables: variables_ });
    //     if (response.data[data.query_name]) {
    //       let formatted_data = removeKey(response.data[data.query_name], "__typename");
    //       exportExcel(formatted_data);
    //     }
    //   },
    // },
  ];
  const exportPDFOptions = [
    {
      label: "Export current table",
      icon: "pi pi-file-pdf",
      command: () => {
        let formatted_data = dataQuery ? dataQuery[data.query_name] : [];
        formatted_data = removeKey(formatted_data, "__typename");
        exportPdf(formatted_data);
      },
    },
    {
      label: "Export next 100 rows",
      icon: (
        <img alt="Export 100 rows PDF" src={pdf100} style={{ width: "40px" }} />
      ),
      command: async () => {
        let variables_ = {
          ...variables,
          limit: 100,
          offset: 0,
        };
        let response = await exportQuery({ variables: variables_ });
        if (response.data[data.query_name]) {
          let formatted_data = removeKey(
            response.data[data.query_name],
            "__typename"
          );
          exportPdf(formatted_data);
        }
      },
    },
    {
      label: "Export next 1000 rows",
      icon: (
        <img
          alt="Export 1000 rows PDF"
          src={pdf1000}
          style={{ width: "40px" }}
        />
      ),
      command: async () => {
        let variables_ = {
          ...variables,
          limit: 1000,
          offset: 0,
        };
        let response = await exportQuery({ variables: variables_ });
        if (response.data[data.query_name]) {
          let formatted_data = removeKey(
            response.data[data.query_name],
            "__typename"
          );
          exportPdf(formatted_data);
        }
      },
    },
    {
      label: "Export next 5000 rows",
      icon: (
        <img
          alt="Export 5000 rows PDF"
          src={pdf5000}
          style={{ width: "40px" }}
        />
      ),
      command: async () => {
        let variables_ = {
          ...variables,
          limit: 5000,
          offset: 0,
        };
        let response = await exportQuery({ variables: variables_ });
        if (response.data[data.query_name]) {
          let formatted_data = removeKey(
            response.data[data.query_name],
            "__typename"
          );
          exportPdf(formatted_data);
        }
      },
    },
    // {
    //   label: "Export all",
    //   icon: <img alt="Export all rows PDF" />,
    //   command: async () => {
    //     let variables_ = {
    //       ...variables,
    //       limit: null,
    //       offset: 0,
    //     };
    //     let response = await exportQuery({ variables: variables_ });
    //     if (response.data[data.query_name]) {
    //       let formatted_data = removeKey(response.data[data.query_name], "__typename");
    //      exportPdf(formatted_data);
    //     }
    //   },
    // },
  ];

  const renderHeader = () => {
    return (
      <Row className="justify-content-between align-items-center CCTable__header">
        <span
          className="p-input-icon-left"
          style={{
            display: "inline-block",
            width: "auto",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <i className="pi pi-search" style={{ marginLeft: "10px" }} />
          <input
            type="text"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
        <Row style={{ display: "inline-block", width: "auto" }}>
          <Col style={{ display: "flex", alignItems: "center" }}>
            <MultiSelect
              value={selectedColumns}
              onChange={(e) => {
                updateColumns(e.value);
              }}
              options={totalColumns}
              optionLabel="name"
              display="chip"
              placeholder="Select Columns"
              maxSelectedLabels={3}
              className="CCTable__column-selector"
            />
            <Row
              style={{ position: "relative", width: "200px", height: "40px" }}
            >
              <Tooltip target=".exportExcelOptions .p-speeddial-action" />
              <SpeedDial
                model={exportExcelOptions}
                className="exportExcelOptions"
                direction="down"
                style={{ left: 30, top: 0, width: "40px" }}
                showIcon="pi pi-file-excel"
                hideIcon="pi pi-file-excel"
                buttonClassName="CCTable__speedDial CCTable__speedDial-excel"
              />
              <Tooltip target=".exportPDFOptions .p-speeddial-action" />
              <SpeedDial
                model={exportPDFOptions}
                className="exportPDFOptions"
                direction="down"
                style={{ left: 80, top: 0, width: "40px" }}
                showIcon="pi pi-file-pdf"
                hideIcon="pi pi-file-pdf"
                buttonClassName="CCTable__speedDial CCTable__speedDial-pdf"
              />
              <Button
                style={{ left: "130px", width: "40px", height: "40px" }}
                type="button"
                icon="pi pi-times"
                severity="danger"
                rounded
                onClick={() => setShowModal(true)}
              />
            </Row>
          </Col>
        </Row>
      </Row>
    );
  };

  const header = renderHeader();

  const footer = (
    <Row className="justify-content-start">
      <div style={{ display: "inline-block", width: "auto" }}>
        <small>{"Total rows: " + formatWithSeparators(totalRecords)}</small>
      </div>
    </Row>
  );

  const formatDate = (value: any) => {
    if (value) {
      return value.replace("T", " ").replace(".000Z", "");
    } else {
      return value;
    }
    // return value.toLocaleDateString() + " " + value.toLocaleTimeString();
  };

  const dateBodyTemplate = (rowData: any, el: string) => {
    return formatDate(rowData[el]);
    // return formatDate(new Date(rowData[el]));
  };

  const numberBodyTemplate = (rowData: any, el: string) => {
    return formatWithSeparators(rowData[el]);
  };

  const dateFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="dd/mm/yy"
        placeholder="dd/mm/yyyy"
        mask="99/99/9999"
      />
    );
  };

  return (
    <div className="CCTable__container">
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
      <DataTable
        ref={dt}
        value={dataQuery ? dataQuery[data.query_name] : []}
        lazy
        showGridlines
        dataKey={data.table_id}
        paginator
        first={lazyState.first}
        rows={lazyState.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        onSort={onSort}
        sortField={lazyState.sortField || ""}
        sortOrder={
          lazyState.sortOrder === null
            ? null
            : (lazyState.sortOrder as 0 | 1 | -1)
        }
        onFilter={onFilter}
        filters={lazyState.filters}
        loading={loadingQuery}
        header={!onlyView ? header : null}
        footer={footer}
        emptyMessage="No data found."
        resizableColumns
        rowsPerPageOptions={[5, 10, 25, 50]}
      >
        {columns.map(function (el) {
          let type = getType(el);
          let body;
          let filterElement;
          let footer;
          if (type === "date") {
            body = (el_: any) => dateBodyTemplate(el_, el);
            filterElement = dateFilterTemplate;
          } else if (type === "numeric") {
            body = (el_: any) => numberBodyTemplate(el_, el);
          }
          if (type === "numeric" && dataSumQuery) {
            if (dataSumQuery[el]) {
              footer = (
                <span>
                  <strong>Total: </strong>
                  {formatWithSeparators(dataSumQuery[el])}
                </span>
              );
            }
          }
          return (
            <Column
              key={"column-" + el + "-" + data.table_name}
              field={el}
              dataType={type || undefined}
              body={body}
              filterElement={filterElement}
              header={el.replace("_", " ")}
              sortable
              filter={!onlyView}
              filterPlaceholder={"Search by " + el}
              style={{ minWidth: "12rem" }}
              footer={footer}
            />
          );
        })}
      </DataTable>
      <Modal isOpen={showModal} style={customStyles}>
        <div className="CCTable__action-modal">
          <Row style={{ marginBottom: "20px" }}>
            <Col>
              <label>Are you sure to delete the table</label>
              <h2>{data.table_name}</h2>
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
              <button onClick={deleteTable}>Accept</button>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
}
