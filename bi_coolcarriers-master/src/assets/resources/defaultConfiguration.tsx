const generalDefaultConfiguration = {
  sections: [
    {
      section_name: "ASOEX",
      pages: [
        {
          page_name: "Statistics",
          elements: [],
        },
        {
          page_name: "General",
          elements: [
            {
              id: "component-table-1692675051932",
              element_type: "table",
              table_name: "shipments",
              table_id: "shipments_id",
              columns: [
                "arrival_date",
                "asoex_documents_id",
                "boxes",
                "created_at",
                "date",
                "destination_country",
                "destination_port",
                "destination_region",
                "exporters_id",
                "port_of_shipment",
                "receivers_id",
                "region",
                "region_of_origin_code",
                "shipment_condition",
                "shipments_id",
                "ships_id",
                "species_name",
                "updated_at",
                "varieties_name",
                "week_number",
                "weight",
              ],
              active_columns: [
                "arrival_date",
                "asoex_documents_id",
                "boxes",
                "created_at",
                "date",
                "destination_country",
                "destination_port",
                "destination_region",
                "exporters_id",
                "port_of_shipment",
                "receivers_id",
                "region",
                "region_of_origin_code",
                "shipment_condition",
                "shipments_id",
                "ships_id",
                "species_name",
                "updated_at",
                "varieties_name",
                "week_number",
                "weight",
              ],
              data: null,
              query_name: "list_shipments",
              query:
                '\n            query list_shipments($limit: Int, $offset: Int, $order: JSON, $columns_like: JSON, $filters: JSON){\n              list_shipments(limit: $limit, offset: $offset, order: $order, columns_like: $columns_like){\n                  arrival_date,asoex_documents_id,boxes,created_at,date,destination_country,destination_port,destination_region,exporters_id,port_of_shipment,receivers_id,region,region_of_origin_code,shipment_condition,shipments_id,ships_id,species_name,updated_at,varieties_name,week_number,weight\n              }\n              count_rows(table_name: "shipments", filters: $filters)\n            }\n            ',
              variables: {
                limit: 10,
                offset: 0,
                order: "[{'column':'shipments_id','order':'ASC'}]",
                columns_like: null,
                filters: null,
              },
              filters: {
                global: { value: null, matchMode: "contains" },
                arrival_date: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                asoex_documents_id: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                boxes: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                created_at: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                date: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                destination_country: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                destination_port: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                destination_region: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                exporters_id: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                port_of_shipment: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                receivers_id: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                region: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                region_of_origin_code: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                shipment_condition: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                shipments_id: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                ships_id: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                species_name: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                updated_at: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                varieties_name: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                week_number: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
                weight: {
                  operator: "and",
                  constraints: [{ value: null, matchMode: "contains" }],
                },
              },
              label: "Shipments",
            },
          ],
        },
      ],
    },
    {
      section_name: "SCSDOC",
      pages: [
        {
          page_name: "Statistics",
          elements: [
            {
              id: "component-pivottable-1",
              element_type: "pivotTable",
              source_url:
                "https://coolcarriers-public-storage.s3.amazonaws.com/Base+datos+BL+SCS+2022-23+(1).csv",
              table_display_name: "Commodity vs Type of Shipments",
              states: {
                rows: ["Commodity"],
                aggregatorName: "Sum",
                vals: ["Phy position"],
                cols: ["Type Of Shipment"],
                valueFilter: { "BL Status": { Cancelled: true, Draft: true } },
                rendererName: "Table",
              },
            },
            {
              id: "component-pivottable-2",
              element_type: "pivotTable",
              source_url:
                "https://coolcarriers-public-storage.s3.amazonaws.com/Base+datos+BL+SCS+2022-23+(1).csv",
              table_display_name: "Commodity vs Type of Shipments",
              states: {
                rows: ["Commodity"],
                aggregatorName: "Sum",
                vals: ["Phy position"],
                cols: ["Type Of Shipment"],
                valueFilter: {
                  "BL Status": { Cancelled: true, Draft: true },
                  "Terminal POD": {
                    Wilmington: true,
                    TPSV: true,
                    "PORT OF TAURANGA": true,
                    TPC: true,
                  },
                },
                rendererName: "Table",
              },
            },
            {
              id: "component-pivottable-3",
              element_type: "pivotTable",
              source_url:
                "https://coolcarriers-public-storage.s3.amazonaws.com/Base+datos+BL+SCS+2022-23+(1).csv",
              table_display_name: "Commodity vs Week",
              states: {
                rows: ["Commodity"],
                aggregatorName: "Sum",
                vals: ["Phy position"],
                cols: ["Week"],
                valueFilter: { "BL Status": { Cancelled: true, Draft: true } },
                rendererName: "Table",
              },
            },
            {
              id: "component-pivottable-4",
              element_type: "pivotTable",
              source_url:
                "https://coolcarriers-public-storage.s3.amazonaws.com/Base+datos+BL+SCS+2022-23+(1).csv",
              table_display_name: "Consignee",
              states: {
                rows: ["Consignee"],
                aggregatorName: "Sum",
                vals: ["Phy position"],
                valueFilter: { "BL Status": { Cancelled: true, Draft: true } },
                rendererName: "Table",
              },
            },
            {
              id: "component-pivottable-5",
              element_type: "pivotTable",
              source_url:
                "https://coolcarriers-public-storage.s3.amazonaws.com/Base+datos+BL+SCS+2022-23+(1).csv",
              table_display_name: "USWC Shipper",
              states: {
                rows: ["Shipper"],
                cols: ["Week"],
                aggregatorName: "Sum",
                vals: ["Phy position"],
                valueFilter: {
                  "BL Status": { Cancelled: true, Draft: true },
                  POD: {
                    Coquimbo: true,
                    "Gloucester City, NJ": true,
                    Tauranga: true,
                    Valparaiso: true,
                    "Wilmington, DE": true,
                  },
                },
                rendererName: "Table",
              },
            },
            {
              id: "component-pivottable-6",
              element_type: "pivotTable",
              source_url:
                "https://coolcarriers-public-storage.s3.amazonaws.com/Base+datos+BL+SCS+2022-23+(1).csv",
              table_display_name: "USWC Shipper",
              states: {
                rows: ["Shipper"],
                cols: ["Week"],
                aggregatorName: "Sum",
                vals: ["Phy position"],
                valueFilter: {
                  "BL Status": { Cancelled: true, Draft: true },
                  POD: {
                    Coquimbo: true,
                    "Los Angeles, CA": true,
                    Tauranga: true,
                    Valparaiso: true,
                    "Wilmington, DE": true,
                  },
                },
                rendererName: "Table",
              },
            },
          ],
        },
      ],
    },
  ],
  platform_configurations_id: "dd25d5f8-cb3d-4ec2-a6f8-c4de22a1d5a1",
};

export { generalDefaultConfiguration };
