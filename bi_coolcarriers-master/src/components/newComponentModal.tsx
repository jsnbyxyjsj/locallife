import { useState, useEffect } from "react";
import { useAppContext } from "../libs/contextLib";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useMutation, gql } from "@apollo/client";

// === Components ===
import Modal from "react-modal";
import { Row, Col } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";

// === Functions ===
import { tables_asoex, tables_scsdoc } from "../libs/tablesReferences";

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

Modal.setAppElement("body");
function NewComponentModal({ showModal, setShowModal }: any) {
  const {
    userConfiguration,
    setUserConfiguration,
    currentPage,
    currentSection,
  } = useAppContext();

  const [componentType, setComponentType] = useState("");
  const [tableName, setTableName] = useState(null);
  const [legend, setLegend] = useState("");
  const [columnX, setColumnX] = useState<{
    name: string;
    code: string;
    type: string;
  } | null>(null);
  const [columnY, setColumnY] = useState<{
    name: string;
    code: string;
    type: string;
  } | null>(null);
  const [componentTitle, setComponentTitle] = useState("");
  const [columns, setColumns] = useState<
    { name: string; code: string; type: string }[]
  >([]);
  const [tablesOptions, setTablesOptions] = useState<
    { label: string; items: { label: any; value: any }[] }[] | null
  >(null);
  const [columnsOptions, setColumnsOptions] = useState<
    { name: string; code: string; type: string }[] | null
  >(null);
  const [chartFilters, setChartFilters] = useState<any>({});
  const [comparatives, setComparatives] = useState<any>([]);
  const [chartType, setChartType] = useState<{
    name: string;
    code: string;
  } | null>(null);

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

  const chartTypeOptions = [
    {
      name: "area",
      code: "area",
    },
    {
      name: "bar",
      code: "bar",
    },
    {
      name: "line",
      code: "line",
    },
  ];

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

  useEffect(() => {
    if (!tablesOptions) {
      let asoex_items = tables_asoex.map(function (data: any) {
        return { label: data.table, value: data.table };
      });
      asoex_items = asoex_items.sort(function (a, b) {
        a = a.label;
        b = b.label;
        return a < b ? -1 : a > b ? 1 : 0;
      });
      let scsdoc_items = tables_scsdoc.map(function (data: any) {
        return { label: data.table, value: data.table };
      });
      scsdoc_items = scsdoc_items.sort(function (a, b) {
        a = a.label;
        b = b.label;
        return a < b ? -1 : a > b ? 1 : 0;
      });
      let tablesOptions_ = [
        {
          label: "ASOEX",
          items: asoex_items,
        },
        {
          label: "SCSDOC",
          items: scsdoc_items,
        },
      ];
      setTablesOptions(tablesOptions_);
    }
    if (tableName) {
      let table = tables_asoex.filter((el) => el.table === tableName)[0];
      if (!table) {
        table = tables_scsdoc.filter((el: any) => el.table === tableName)[0];
      }
      // get columns
      let columns_ = table.columns.map(function (column) {
        return {
          name: column.column_name,
          code: column.column_name,
          type: column.column_type,
        };
      });
      columns_ = columns_.sort(function (a: any, b: any) {
        a = a.name;
        b = b.name;
        return a < b ? -1 : a > b ? 1 : 0;
      });
      setColumnsOptions(columns_);
      setColumns([]);
    }
  }, [tableName]);

  const groupedItemTemplate = (option: any) => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (componentType === "table") {
      if (userConfiguration && columns && columnsOptions) {
        let sections = [...userConfiguration.sections];
        let index = sections
          .map((el) => el.section_name)
          .indexOf(currentSection);
        let pages = [...sections[index].pages];
        let index_page = pages.map((el) => el.page_name).indexOf(currentPage);
        let elements = [...pages[index_page]["elements"]];
        let pk = tables_asoex.filter((el: any) => el.table === tableName)[0]
          ?.pk;
        if (!pk) {
          pk = tables_scsdoc.filter((el: any) => el.table === tableName)[0]?.pk;
        }
        let columns_ = columns.map((el: any) => el.name).join(",");
        let filters_: any = {
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        };
        let filters_columns = columns.map((el: any) => el.name);
        for (let i = 0; i < columns.length; i++) {
          if (!Object.keys(filters_).includes(filters_columns[i])) {
            filters_[filters_columns[i]] = {
              operator: FilterOperator.AND,
              constraints: [
                { value: null, matchMode: FilterMatchMode.CONTAINS },
              ],
            };
          }
        }
        let new_element: any = {
          id: "component-table-" + Date.now(),
          element_type: "table",
          table_name: tableName,
          table_id: pk,
          columns: columnsOptions.map((el: any) => el.name),
          active_columns: columns.map((el: any) => el.name),
          data: null,
          query_name: "list_" + tableName,
          query:
            `
            query list_` +
            tableName +
            `($limit: Int, $offset: Int, $order: JSON, $columns_like: JSON, $filters: JSON){
              list_` +
            tableName +
            `(limit: $limit, offset: $offset, order: $order, columns_like: $columns_like){
                  ` +
            columns_ +
            `
              }
              count_rows(table_name: "` +
            tableName +
            `", filters: $filters)
            }
            `,
          variables: {
            limit: 10,
            offset: 0,
            order: "[{'column':'" + pk + "','order':'ASC'}]",
            columns_like: null,
            filters: null,
          },
          filters: filters_,
          label: componentTitle,
        };
        elements.push(new_element);
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
    } else {
      if (userConfiguration && columnX && chartType) {
        let sections = [...userConfiguration.sections];
        let index = sections
          .map((el) => el.section_name)
          .indexOf(currentSection);
        let pages = [...sections[index].pages];
        let index_page = pages.map((el) => el.page_name).indexOf(currentPage);
        let elements = [...pages[index_page]["elements"]];
        let columns = [
          {
            table_name: tableName,
            column_name: columnX.name,
            column_type: getType(columnX.type),
            column_purpose: "axisX",
            filter_type: null,
            filter_value: null,
            n_ranges: 10,
          },
        ];
        if (columnY) {
          columns.push({
            table_name: tableName,
            column_name: columnY.name,
            column_type: getType(columnY.type),
            column_purpose: "axisY",
            filter_type: null,
            filter_value: null,
            n_ranges: 0,
          });
        }
        for (var i = 0; i < Object.values(chartFilters).length; i++) {
          let filter: any = Object.values(chartFilters)[i];
          columns.push({
            table_name: tableName,
            column_name: filter.column_name.name,
            column_type: filter.column_type,
            column_purpose: "filter",
            filter_type: filter.filter_type.code,
            filter_value: filter.filter_value,
            n_ranges: 0,
          });
        }
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
                table_name: tableName,
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
        let new_element: any = {
          id: "component-chart-" + Date.now(),
          element_type: "chart",
          query_name_x: "count_unique_elements",
          query_x: `query count_unique_elements($table_name: String!, $column_name: String!, $filters: JSON){
            count_unique_elements(table_name: $table_name, column_name: $column_name, filters: $filters)
          }`,
          query_name_y: columnY ? "list_" + tableName : null,
          query_y: columnY
            ? `query list_${tableName}($arrays: JSON, $columns_like: JSON){
            list_${tableName}(arrays: $arrays, columns_like: $columns_like) {
              ${columnX.name}
              ${columnY.name}
            }
          }`
            : null,
          label: componentTitle,
          columns: columns,
          xKey: columnX.name,
          yKey: columnY ? columnY.name : "frequency",
          type: chartType.name,
          data: null,
          legend: legend,
          comparative_data: comparative_data,
        };
        elements.push(new_element);
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
    }
    cleanInputs();
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

  const cleanInputs = () => {
    setComponentType("");
    setTableName(null);
    setColumnX(null);
    setColumnY(null);
    setComponentTitle("");
    setColumns([]);
    setChartFilters({});
    setChartType(null);
    setLegend("");
    setComparatives([]);
  };

  return (
    <Modal isOpen={showModal} style={customStyles}>
      <div className="newComponentModal">
        <Row>
          <Col className="newComponentModal__select-type">
            <label>Select a component</label>
            <Row>
              <Col>
                <button
                  onClick={() => setComponentType("table")}
                  className={
                    componentType === "table"
                      ? "newComponentModal__select-type-button--active"
                      : ""
                  }
                >
                  <i
                    className="pi pi-table"
                    style={{ marginRight: "10px" }}
                  ></i>
                  Table
                </button>
              </Col>
              <Col>
                <button
                  onClick={() => setComponentType("chart")}
                  className={
                    componentType === "chart"
                      ? "newComponentModal__select-type-button--active"
                      : ""
                  }
                >
                  <i
                    className="pi pi-chart-line"
                    style={{ marginRight: "10px" }}
                  ></i>
                  Chart
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
        {componentType && (
          <div>
            <Row className="newComponentModal__select-table">
              <Col>
                <label>Enter a component name</label>
                <div>
                  <input
                    type="text"
                    value={componentTitle}
                    onChange={(e) => setComponentTitle(e.target.value)}
                    placeholder=""
                  />
                </div>
              </Col>
            </Row>
            <Row className="newComponentModal__select-table">
              <Col>
                <label>Select a table</label>
                {tablesOptions ? (
                  <div>
                    <Dropdown
                      value={tableName}
                      onChange={(e) => setTableName(e.value)}
                      options={tablesOptions}
                      optionLabel="label"
                      optionGroupLabel="label"
                      optionGroupChildren="items"
                      optionGroupTemplate={groupedItemTemplate}
                      className="newComponentModal__dropdown"
                      placeholder="Tables"
                    />
                  </div>
                ) : null}
              </Col>
            </Row>
            {componentType === "chart" && (
              <Row className="newComponentModal__select-table">
                <Col>
                  <label>Select a chart type</label>
                  <div>
                    <Dropdown
                      value={chartType}
                      onChange={(e) => setChartType(e.value)}
                      options={chartTypeOptions}
                      optionLabel="name"
                      className="newComponentModal__dropdown"
                      placeholder="Types"
                    />
                  </div>
                </Col>
              </Row>
            )}
          </div>
        )}
        {componentType && tableName && (
          <Row className="newComponentModal__select-columns">
            {componentType === "table" && (
              <Col>
                <label>Select active columns</label>
                {columnsOptions ? (
                  <div>
                    <MultiSelect
                      value={columns}
                      onChange={(e) => setColumns(e.value)}
                      options={columnsOptions}
                      optionLabel="name"
                      placeholder="Colums"
                      maxSelectedLabels={3}
                      className="newComponentModal__dropdown"
                    />
                  </div>
                ) : null}
              </Col>
            )}
            {componentType === "chart" && (
              <Col>
                <label>Select columns</label>
                {columnsOptions ? (
                  <div>
                    <span>X Axis</span>
                    <Dropdown
                      value={columnX}
                      onChange={(e) => {
                        setColumnX(e.value);
                      }}
                      style={{ marginLeft: "10px" }}
                      options={columnsOptions}
                      optionLabel="name"
                      className="newComponentModal__dropdown"
                      placeholder="Columns"
                    />
                  </div>
                ) : null}
                {columnsOptions ? (
                  <div>
                    <span>Y Axis</span>
                    <Dropdown
                      value={columnY}
                      onChange={(e) => {
                        setLegend(e.value.name);
                        setColumnY(e.value);
                      }}
                      style={{ marginLeft: "10px" }}
                      options={columnsOptions.filter(function (el: any) {
                        return getType(el.type) === "number";
                      })}
                      optionLabel="name"
                      className="newComponentModal__dropdown"
                      placeholder="Columns"
                    />
                  </div>
                ) : null}
                <div>
                  <span>Legend</span>
                  <input
                    type="text"
                    style={{ width: "50%", marginLeft: "10px" }}
                    value={legend}
                    onChange={(e) => setLegend(e.target.value)}
                    placeholder=""
                  />
                </div>
                <button
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
                {Object.values(chartFilters).map(function (filter: any) {
                  let column_type = "text";
                  if (filter.column_type !== column_type)
                    column_type = filter.column_type;
                  return (
                    <Row className="align-items-center" key={filter.id}>
                      <Col>
                        <Dropdown
                          value={chartFilters[filter.id].column_name || null}
                          onChange={(e) => {
                            if (columnsOptions) {
                              setChartFilters({
                                ...chartFilters,
                                [filter.id]: {
                                  ...chartFilters[filter.id],
                                  column_name: e.value,
                                  column_type: getType(
                                    columnsOptions.find(
                                      (el) => el.name === e.value.name
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
                          value={chartFilters[filter.id].filter_type || null}
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
                            value={chartFilters[filter.id].filter_value}
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
                                        ...comparatives[index].filters[
                                          filter.id
                                        ],
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
                                  type={
                                    column_type === "text" ? "text" : "number"
                                  }
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
                                        ...comparatives[index].filters[
                                          filter.id
                                        ],
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
                                        ...comparatives[index].filters[
                                          filter.id
                                        ],
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
                              Object.values(comparative.filters).every(
                                (obj: any) =>
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
              </Col>
            )}
          </Row>
        )}
        <Row className="newComponentModal__buttons justify-content-center">
          <Col style={{ textAlign: "center" }}>
            <button
              onClick={() => {
                cleanInputs();
                setShowModal(false);
              }}
            >
              Cancel
            </button>
          </Col>
          <Col style={{ textAlign: "center" }}>
            <button
              disabled={
                !(
                  componentType &&
                  componentTitle !== "" &&
                  tableName &&
                  (columns?.length > 0 || componentType === "chart") &&
                  (chartType || componentType === "table") &&
                  (columnX || componentType === "table") &&
                  (Object.values(chartFilters).every((obj: any) =>
                    Object.values(obj).every((value) => !!value)
                  ) ||
                    componentType === "table") &&
                  (Object.values(comparatives).every((obj: any) =>
                    Object.values(obj).every((value) => !!value)
                  ) ||
                    componentType === "table") &&
                  (legend || componentType === "table")
                )
              }
              onClick={() => {
                handleSubmit();
              }}
            >
              Accept
            </button>
          </Col>
        </Row>
      </div>
    </Modal>
  );
}

export default NewComponentModal;
