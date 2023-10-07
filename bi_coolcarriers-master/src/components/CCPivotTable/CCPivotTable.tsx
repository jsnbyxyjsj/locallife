import { useEffect, useState } from "react";
import { useAppContext } from "../../libs/contextLib";
import axios from "axios";

// === Components ===
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import Papa from "papaparse";
import { Row } from "react-bootstrap";

// === Images ===
import loaderGifCC from "../../assets/images/loader-cc-gray.gif";

const PlotlyRenderers = createPlotlyRenderers(Plot);

function CCPivotTable({ data }: any) {
  const {
    userConfiguration,
    setUserConfiguration,
    currentSection,
    currentPage,
  } = useAppContext();
  const [showControls, setShowControls] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<any>(null);
  const [state, setState] = useState<any>(data.states || null);

  const getCSVFile = async (url: string) => {
    try {
      let response = await axios
        .get(url)
        .then((res: any) => {
          return res.data;
        })
        .catch((err: any) => {
          if (err.response.data.includes("<Code>ExpiredToken</Code>")) {
            console.log("ERROR (EXPIRED TOKEN): ", err.response);
            window.location.href = "/";
          } else {
            console.log("ERROR (UNEXPECTED): ", err.response);
            window.location.href = "/";
          }
        });
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const parseCsv = (csvData: string) => {
    return Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        return result.data;
      },
      error: (err: any) => {
        console.log(err.message);
        return null;
      },
    });
  };

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
    }
  };

  useEffect(() => {
    const pageInit = async () => {
      if (data) {
        if (data.formatData) {
          setDataTable(data.formatData);
        } else {
          let url = data.source_url;
          let data_ = await getCSVFile(url);
          data_ = parseCsv(data_);
          let formatData = data_.data;
          setDataTable(formatData);
          updateComponent({ ...data, formatData: formatData });
        }
      }
    };
    pageInit();
  }, [data]);

  return (
    <div
      className={
        "CCPivotTable" + (!showControls ? " CCPivotTable__collapsed" : "")
      }
    >
      {dataTable !== null ? (
        <div>
          <div className="CCPivotTable__title">
            <h1>{data.table_display_name}</h1>
            <i
              className="pi pi-search"
              style={{
                color: "#8A99AF",
                cursor: "pointer",
                marginLeft: "20px",
                fontSize: "18px",
                marginTop: "-10px",
              }}
              onClick={() => setShowControls(!showControls)}
            ></i>
          </div>
          <PivotTableUI
            data={dataTable}
            onChange={(s: any) => setState(s)}
            renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
            unusedOrientationCutoff={Infinity}
            {...state}
          />
        </div>
      ) : (
        <Row className="CCPivotTable__loading justify-content-center align-items-center">
          <img src={loaderGifCC}></img>
        </Row>
      )}
    </div>
  );
}

export default CCPivotTable;
