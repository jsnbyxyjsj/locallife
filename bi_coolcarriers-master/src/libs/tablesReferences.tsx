export const tables_asoex = [
  // {
  //   table: "asoex_documents",
  //   pk: "asoex_documents_id",
  //   columns: [
  //     { column_name: "asoex_documents_id", column_type: "VARCHAR(255)" },
  //     { column_name: "uploaded_by", column_type: "VARCHAR(255)" },
  //     { column_name: "start_date", column_type: "DATETIME" },
  //     { column_name: "end_date", column_type: "DATETIME" },
  //     { column_name: "created_at", column_type: "DATETIME" },
  //     { column_name: "updated_at", column_type: "DATETIME" },
  //   ],
  //   source_id: "asoex_tables",
  //   subsection: "",
  // },
  // {
  //   table: "species",
  //   pk: "species_name",
  //   columns: [
  //     { column_name: "species_name", column_type: "VARCHAR(255)" },
  //     { column_name: "asoex_documents_id", column_type: "VARCHAR(255)" },
  //     { column_name: "created_at", column_type: "DATETIME" },
  //     { column_name: "updated_at", column_type: "DATETIME" },
  //   ],
  //   source_id: "asoex_tables",
  //   subsection: "",
  // },
  // {
  //   table: "species_details",
  //   pk: "species_details_id",
  //   columns: [
  //     { column_name: "species_details_id", column_type: "VARCHAR(255)" },
  //     { column_name: "display_name", column_type: "VARCHAR(255)" },
  //     { column_name: "species_name", column_type: "VARCHAR(255)" },
  //     { column_name: "languages_name", column_type: "VARCHAR(255)" },
  //     { column_name: "asoex_documents_id", column_type: "VARCHAR(255)" },
  //     { column_name: "created_at", column_type: "DATETIME" },
  //     { column_name: "updated_at", column_type: "DATETIME" },
  //   ],
  //   source_id: "asoex_tables",
  //   subsection: "",
  // },
  // {
  //   table: "varieties",
  //   pk: "varieties_name",
  //   columns: [
  //     { column_name: "varieties_name", column_type: "VARCHAR(255)" },
  //     { column_name: "asoex_documents_id", column_type: "VARCHAR(255)" },
  //     { column_name: "created_at", column_type: "DATETIME" },
  //     { column_name: "updated_at", column_type: "DATETIME" },
  //   ],
  //   source_id: "asoex_tables",
  //   subsection: "",
  // },
  // {
  //   table: "varieties_details",
  //   pk: "varieties_details_id",
  //   columns: [
  //     { column_name: "varieties_details_id", column_type: "VARCHAR(255)" },
  //     { column_name: "display_name", column_type: "VARCHAR(255)" },
  //     { column_name: "varieties_name", column_type: "VARCHAR(255)" },
  //     { column_name: "languages_name", column_type: "VARCHAR(255)" },
  //     { column_name: "asoex_documents_id", column_type: "VARCHAR(255)" },
  //     { column_name: "created_at", column_type: "DATETIME" },
  //     { column_name: "updated_at", column_type: "DATETIME" },
  //   ],
  //   source_id: "asoex_tables",
  //   subsection: "",
  // },
  // {
  //   table: "receivers",
  //   pk: "receivers_id",
  //   columns: [
  //     { column_name: "receivers_id", column_type: "VARCHAR(255)" },
  //     { column_name: "display_name", column_type: "VARCHAR(255)" },
  //     { column_name: "asoex_documents_id", column_type: "VARCHAR(255)" },
  //     { column_name: "created_at", column_type: "DATETIME" },
  //     { column_name: "updated_at", column_type: "DATETIME" },
  //   ],
  //   source_id: "asoex_tables",
  //   subsection: "",
  // },
  // {
  //   table: "exporters",
  //   pk: "exporters_id",
  //   columns: [
  //     { column_name: "exporters_id", column_type: "VARCHAR(255)" },
  //     { column_name: "display_name", column_type: "VARCHAR(255)" },
  //     { column_name: "asoex_documents_id", column_type: "VARCHAR(255)" },
  //     { column_name: "created_at", column_type: "DATETIME" },
  //     { column_name: "updated_at", column_type: "DATETIME" },
  //   ],
  //   source_id: "asoex_tables",
  //   subsection: "",
  // },
  // {
  //   table: "ships",
  //   pk: "ships_id",
  //   columns: [
  //     { column_name: "ships_id", column_type: "VARCHAR(255)" },
  //     { column_name: "display_name", column_type: "VARCHAR(255)" },
  //     { column_name: "type", column_type: "VARCHAR(255)" },
  //     { column_name: "asoex_documents_id", column_type: "VARCHAR(255)" },
  //     { column_name: "created_at", column_type: "DATETIME" },
  //     { column_name: "updated_at", column_type: "DATETIME" },
  //   ],
  //   source_id: "asoex_tables",
  //   subsection: "",
  // },
  {
    table: "shipments",
    pk: "shipments_id",
    columns: [
      { column_name: "shipments_id", column_type: "VARCHAR(255)" },
      { column_name: "asoex_documents_id", column_type: "VARCHAR(255)" },
      { column_name: "species_name", column_type: "VARCHAR(255)" },
      { column_name: "varieties_name", column_type: "VARCHAR(255)" },
      { column_name: "boxes", column_type: "INT" },
      { column_name: "weight", column_type: "FLOAT" },
      { column_name: "exporters_id", column_type: "VARCHAR(255)" },
      { column_name: "region", column_type: "VARCHAR(255)" },
      { column_name: "destination_region", column_type: "VARCHAR(255)" },
      { column_name: "destination_port", column_type: "VARCHAR(255)" },
      { column_name: "destination_country", column_type: "VARCHAR(255)" },
      { column_name: "receivers_id", column_type: "VARCHAR(255)" },
      { column_name: "ships_id", column_type: "VARCHAR(255)" },
      { column_name: "week_number", column_type: "INT" },
      { column_name: "date", column_type: "DATE" },
      { column_name: "port_of_shipment", column_type: "VARCHAR(255)" },
      { column_name: "arrival_date", column_type: "DATE" },
      { column_name: "region_of_origin_code", column_type: "INT" },
      { column_name: "shipment_condition", column_type: "VARCHAR(255)" },
      { column_name: "created_at", column_type: "DATETIME" },
      { column_name: "updated_at", column_type: "DATETIME" },
    ],
    source_id: "asoex_tables",
    subsection: "",
  },
];

export const tables_scsdoc = [
  {
    table: "billOfLading",
    pk: "BLContainerId",
    columns: [
      { column_name: "BLContainerId", column_type: "VARCHAR(255)" },
      { column_name: "Vesselname", column_type: "VARCHAR(255)" },
      { column_name: "ComercialVoyageNumber", column_type: "VARCHAR(255)" },
      { column_name: "CarrierShortName", column_type: "VARCHAR(255)" },
      { column_name: "PlaceOfReceivedName", column_type: "VARCHAR(255)" },
      { column_name: "PortOfLoadingCode", column_type: "VARCHAR(255)" },
      { column_name: "PortOfLoadingName", column_type: "VARCHAR(255)" },
      { column_name: "PortOfDischargeCode", column_type: "VARCHAR(255)" },
      { column_name: "PortOfDischargeName", column_type: "VARCHAR(255)" },
      {
        column_name: "PlaceOfFinalDestinationName",
        column_type: "VARCHAR(255)",
      },
      { column_name: "BLNumber", column_type: "VARCHAR(255)" },
      { column_name: "BookingNumberReference", column_type: "VARCHAR(255)" },
      { column_name: "SiNumber", column_type: "VARCHAR(255)" },
      { column_name: "ShipperId", column_type: "INT" },
      { column_name: "ShipperFullName", column_type: "VARCHAR(255)" },
      { column_name: "ConsigneeFullName", column_type: "VARCHAR(255)" },
      { column_name: "NotifyFullName", column_type: "VARCHAR(255)" },
      { column_name: "IssueDate", column_type: "VARCHAR(255)" },
      { column_name: "HeaderTermOfPaymentName", column_type: "VARCHAR(255)" },
      { column_name: "TypeOfBLName", column_type: "VARCHAR(255)" },
      { column_name: "StatusName", column_type: "VARCHAR(255)" },
      { column_name: "TypeOfShipmentName", column_type: "VARCHAR(255)" },
      { column_name: "MerchandiseName", column_type: "VARCHAR(255)" },
      { column_name: "OuterPackageQty", column_type: "INT" },
      {
        column_name: "OuterTypePackagePluralName",
        column_type: "VARCHAR(255)",
      },
      { column_name: "OuterPackagePositionQty", column_type: "INT" },
      { column_name: "PalletSizeTypeName", column_type: "VARCHAR(255)" },
      { column_name: "PalletStandardQty", column_type: "FLOAT" },
      { column_name: "InnerPackageQty", column_type: "INT" },
      {
        column_name: "InnerTypePackagePluralName",
        column_type: "VARCHAR(255)",
      },
      { column_name: "CargoConditionName", column_type: "VARCHAR(255)" },
      { column_name: "GrossWeight", column_type: "FLOAT" },
      { column_name: "GrossWeightUnitCode", column_type: "VARCHAR(255)" },
      { column_name: "GrossWeightKG", column_type: "FLOAT" },
      { column_name: "GrossMeasurement", column_type: "VARCHAR(255)" },
      { column_name: "MeasurementUnitCode", column_type: "VARCHAR(255)" },
      { column_name: "LoadReference", column_type: "VARCHAR(255)" },
      { column_name: "ContainerNumber", column_type: "VARCHAR(255)" },
      { column_name: "SealNumberCarrier", column_type: "VARCHAR(255)" },
      { column_name: "SealNumberUsdaSag", column_type: "VARCHAR(255)" },
      { column_name: "SealNumberCustoms", column_type: "VARCHAR(255)" },
      { column_name: "SealNumberShipper", column_type: "VARCHAR(255)" },
      { column_name: "SealNumberOther", column_type: "VARCHAR(255)" },
      { column_name: "ContainerSizeTypeName", column_type: "VARCHAR(255)" },
      { column_name: "ShipperOwnerName", column_type: "VARCHAR(255)" },
      { column_name: "TypeOfMovemInitialName", column_type: "VARCHAR(255)" },
      { column_name: "TypeOfMovemEndName", column_type: "VARCHAR(255)" },
      { column_name: "ContainerTara", column_type: "FLOAT" },
      { column_name: "TaraWeightUnitCode", column_type: "VARCHAR(255)" },
      { column_name: "Temperature", column_type: "VARCHAR(255)" },
      { column_name: "TemperatureUnitCode", column_type: "VARCHAR(255)" },
      { column_name: "Ventilation", column_type: "VARCHAR(255)" },
      { column_name: "VentilationUnitCode", column_type: "VARCHAR(255)" },
      { column_name: "ControlledAtmosphereName", column_type: "VARCHAR(255)" },
      { column_name: "SI_RegisteredBy", column_type: "VARCHAR(255)" },
      { column_name: "ContractNumber", column_type: "VARCHAR(255)" },
      { column_name: "CustomerShortName", column_type: "VARCHAR(255)" },
      { column_name: "MasterBLNumber", column_type: "VARCHAR(255)" },
      { column_name: "HaulageContractorName", column_type: "VARCHAR(255)" },
      { column_name: "EmptyContainerIndicator", column_type: "BOOLEAN" },
      { column_name: "RegisterNumber", column_type: "VARCHAR(255)" },
      { column_name: "POLETD", column_type: "VARCHAR(255)" },
      { column_name: "EORICarrier", column_type: "VARCHAR(255)" },
      { column_name: "EORIConsignee", column_type: "VARCHAR(255)" },
      { column_name: "HSCode", column_type: "VARCHAR(255)" },
      { column_name: "OuterTypePackageCode", column_type: "VARCHAR(255)" },
      { column_name: "OuterTypePackageISOCode", column_type: "VARCHAR(255)" },
      { column_name: "PODETA", column_type: "VARCHAR(255)" },
      { column_name: "SI_RegisteredCompanyBy", column_type: "VARCHAR(255)" },
      { column_name: "CustomerQuotationNumber", column_type: "VARCHAR(255)" },
      {
        column_name: "CustomerQuotationDetailNumber",
        column_type: "VARCHAR(255)",
      },
      { column_name: "Baroti", column_type: "VARCHAR(255)" },
      { column_name: "VGM", column_type: "VARCHAR(255)" },
      { column_name: "VGMUnitCode", column_type: "VARCHAR(255)" },
      {
        column_name: "TerminalOfLoadingShortName",
        column_type: "VARCHAR(255)",
      },
      {
        column_name: "TerminalOfDischargeShortName",
        column_type: "VARCHAR(255)",
      },
      { column_name: "HazardousMaterialEnabled", column_type: "BOOLEAN" },
      { column_name: "HazardousMaterialCode", column_type: "VARCHAR(255)" },
      { column_name: "HazardousMaterialClass", column_type: "VARCHAR(255)" },
      { column_name: "HazardousMaterialPage", column_type: "VARCHAR(255)" },
      {
        column_name: "HazardousMaterialFlashPointTemp",
        column_type: "VARCHAR(255)",
      },
      {
        column_name: "HazardousMaterialFlashPointTempUnitId",
        column_type: "VARCHAR(255)",
      },
      {
        column_name: "HazardousMaterialFlashPointTempUnitCode",
        column_type: "VARCHAR(255)",
      },
      { column_name: "HazardousMaterialContact", column_type: "VARCHAR(255)" },
      {
        column_name: "HazardousMaterialDescription1",
        column_type: "VARCHAR(255)",
      },
      {
        column_name: "HazardousMaterialNationalClassification1",
        column_type: "VARCHAR(255)",
      },
      {
        column_name: "HazardousMaterialDescription2",
        column_type: "VARCHAR(255)",
      },
      {
        column_name: "HazardousMaterialNationalClassification2",
        column_type: "VARCHAR(255)",
      },
      { column_name: "PurshaseOrderNumber", column_type: "VARCHAR(255)" },
      { column_name: "PurshaseOrderItemNumber", column_type: "VARCHAR(255)" },
      { column_name: "created_at", column_type: "DATETIME" },
      { column_name: "updated_at", column_type: "DATETIME" },
    ],
    source_id: "scsdoc_tables",
    subsection: "bill of lading",
  },
];

// export const tables_scsdoc = [
//   {
//     table: "BLBKRelationship",
//     pk: "BLBKRelationshipId",
//     columns: [
//       { column_name: "BLBKRelationshipId", column_type: "int" },
//       { column_name: "BLHeaderId", column_type: "int" },
//       { column_name: "DeclarationItemId", column_type: "int" },
//       { column_name: "DeclarationContainerId", column_type: "int" },
//       { column_name: "BookingPackageId", column_type: "int" },
//       { column_name: "BookingContainerNumberId", column_type: "int" },
//       { column_name: "RecordStatus", column_type: "int" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "LastUpdate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "bill of lading",
//   },
//   {
//     table: "BLChargeClause",
//     pk: "BLChargeClauseId",
//     columns: [
//       { column_name: "BLChargeClauseId", column_type: "int" },
//       { column_name: "BLHeaderId", column_type: "int" },
//       { column_name: "ClauseId", column_type: "int" },
//       { column_name: "SequenceNumber", column_type: "int" },
//       { column_name: "ClauseDescription", column_type: "nvarchar(1024)" },
//       { column_name: "ClauseComment", column_type: "nvarchar(100)" },
//       { column_name: "RecordStatus", column_type: "int" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "LastUpdate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "bill of lading",
//   },
//   {
//     table: "BLHeader",
//     pk: "BLHeaderId",
//     columns: [
//       { column_name: "BLHeaderId", column_type: "int" },
//       { column_name: "BLNumber", column_type: "nvarchar(40)" },
//       { column_name: "VersionNumber", column_type: "int" },
//       { column_name: "BookingNumberReference", column_type: "nvarchar(50)" },
//       { column_name: "CustomerContractId", column_type: "int" },
//       { column_name: "CustomerQuotationId", column_type: "int" },
//       { column_name: "CustomerQuotationDetailId", column_type: "int" },
//       { column_name: "TypeOfBLId", column_type: "int" },
//       { column_name: "StatusId", column_type: "int" },
//       { column_name: "IssueDate", column_type: "date" },
//       { column_name: "PlaceOfIssueId", column_type: "int" },
//       { column_name: "ShippingTermOfPaymentId", column_type: "int" },
//       { column_name: "InvoicePartyId", column_type: "int" },
//       { column_name: "MasterBLNumber", column_type: "nvarchar(40)" },
//       { column_name: "QuantityOfBLOriginals", column_type: "int" },
//       { column_name: "QuantityOfBLCopies", column_type: "int" },
//       { column_name: "PreCarriageBy", column_type: "nvarchar(64)" },
//       { column_name: "PreCarriageHaulageContractorId", column_type: "int" },
//       { column_name: "OnCarriageHaulageContractorId", column_type: "int" },
//       { column_name: "VoyageId", column_type: "int" },
//       { column_name: "TranshipmentVoyageId", column_type: "int" },
//       { column_name: "PlaceOfReceivedId", column_type: "int" },
//       { column_name: "PortOfLoadingId", column_type: "int" },
//       { column_name: "TerminalOfLoadingId", column_type: "int" },
//       { column_name: "PortOfDischargeId", column_type: "int" },
//       { column_name: "TerminalOfDischargeId", column_type: "int" },
//       { column_name: "PlaceOfFinalDestinationId", column_type: "int" },
//       { column_name: "PortOfTranshipmentId", column_type: "int" },
//       { column_name: "TerminalOfTranshipmentId", column_type: "int" },
//       { column_name: "ExportReference", column_type: "nvarchar(280)" },
//       { column_name: "PointAndCountryOfOrigin", column_type: "nvarchar(80)" },
//       {
//         column_name: "DomesticRouExpInstructions",
//         column_type: "nvarchar(540)",
//       },
//       { column_name: "OnwardInlandRouting", column_type: "nvarchar(280)" },
//       { column_name: "PayerId", column_type: "int" },
//       { column_name: "CountryOfficeId", column_type: "int" },
//       { column_name: "IssuedIndicator", column_type: "boolean" },
//       { column_name: "FinalIssuedDate", column_type: "datetime" },
//       { column_name: "IssuedBy", column_type: "nvarchar(100)" },
//       { column_name: "CalculateStatusId", column_type: "int" },
//       { column_name: "CargoStatusId", column_type: "int" },
//       { column_name: "InvoiceStatusId", column_type: "int" },
//       { column_name: "PaymentStatusId", column_type: "int" },
//       { column_name: "FreightAsPerAgreementIndicator", column_type: "boolean" },
//       { column_name: "NoFreightEnabled", column_type: "boolean" },
//       { column_name: "TypeOfPrintOutLayoutId", column_type: "int" },
//       { column_name: "DetailsOfPreCarriage", column_type: "nvarchar(280)" },
//       { column_name: "DetailsOfOnCarriage", column_type: "nvarchar(280)" },
//       { column_name: "SignedForOnBehalfOfId", column_type: "int" },
//       { column_name: "ZACustomsManifestId", column_type: "nchar(70)" },
//       { column_name: "ZACustomsManifestStatustId", column_type: "int" },
//       {
//         column_name: "ZACustomsManifestStatustName",
//         column_type: "nvarchar(60)",
//       },
//       {
//         column_name: "ZACustomsManifestStatustDescription",
//         column_type: "nvarchar(300)",
//       },
//       {
//         column_name: "ZACustomsManifestStatustMessage",
//         column_type: "nvarchar(2048)",
//       },
//       { column_name: "RecordStatus", column_type: "int" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "LastUpdate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "bill of lading",
//   },
//   {
//     table: "BLHouseThirdParty",
//     pk: "BLHouseThirdPartyId",
//     columns: [
//       { column_name: "BLHouseThirdPartyId", column_type: "int" },
//       { column_name: "BLHeaderId", column_type: "int" },
//       { column_name: "BLNumber", column_type: "nvarchar(40)" },
//       { column_name: "RecordStatus", column_type: "int" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "LastUpdate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "bill of lading",
//   },
//   {
//     table: "BookingContainer",
//     pk: "BookingContainerId",
//     columns: [
//       { column_name: "BookingContainerId", column_type: "int" },
//       { column_name: "BookingHeaderId", column_type: "int" },
//       { column_name: "BookingNumber", column_type: "nvarchar(50)" },
//       { column_name: "KeyBookingNumber", column_type: "nvarchar(510)" },
//       { column_name: "ContainerQty", column_type: "int" },
//       { column_name: "ContainerSizeTypeId", column_type: "int" },
//       { column_name: "ShipperId", column_type: "int" },
//       { column_name: "PortOfLoadingId", column_type: "int" },
//       { column_name: "TerminalOfLoadingId", column_type: "int" },
//       { column_name: "PortOfDischargeId", column_type: "int" },
//       { column_name: "TerminalOfDischargeId", column_type: "int" },
//       { column_name: "PlaceOfFinalDestinationId", column_type: "int" },
//       { column_name: "Temperature", column_type: "decimal(189)" },
//       { column_name: "TemperatureUnitId", column_type: "int" },
//       { column_name: "Ventilation", column_type: "decimal(189)" },
//       { column_name: "VentilationUnitId", column_type: "int" },
//       { column_name: "ControlledAtmosphereEnabled", column_type: "boolean" },
//       { column_name: "ControlledAtmosphereId", column_type: "int" },
//       {
//         column_name: "ControlledAtmosphereParameters",
//         column_type: "nchar(40)",
//       },
//       { column_name: "DepotId", column_type: "int" },
//       { column_name: "ConsolidationZoneId", column_type: "int" },
//       { column_name: "TypeOfMovementId", column_type: "int" },
//       { column_name: "HaulageContractorId", column_type: "int" },
//       { column_name: "Remarks", column_type: "nvarchar(1000)" },
//       { column_name: "RecordStatus", column_type: "int" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "CreatedBy", column_type: "nvarchar(100)" },
//       { column_name: "LastUpdate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "vessel declaration",
//   },
//   {
//     table: "BookingContainerNumber",
//     pk: "BookingContainerNumberId",
//     columns: [
//       { column_name: "BookingContainerNumberId", column_type: "int" },
//       { column_name: "BookingContainerId", column_type: "int" },
//       { column_name: "ContainerNumber", column_type: "nchar(22)" },
//       { column_name: "ContainerTare", column_type: "decimal(189)" },
//       { column_name: "WeightUnitId", column_type: "int" },
//       { column_name: "SealNumber1", column_type: "nchar(24)" },
//       { column_name: "ContainerOperatorId", column_type: "int" },
//       { column_name: "ControlledAtmosphereId", column_type: "int" },
//       { column_name: "RecordStatus", column_type: "int" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "CreatedBy", column_type: "nvarchar(100)" },
//       { column_name: "LastUpdate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "vessel declaration",
//   },
//   {
//     table: "BookingHeader",
//     pk: "BookingHeaderId",
//     columns: [
//       { column_name: "BookingHeaderId", column_type: "int" },
//       { column_name: "VoyageId", column_type: "int" },
//       { column_name: "GroupId", column_type: "int" },
//       { column_name: "CustomerVoyageNumber", column_type: "nchar(40)" },
//       { column_name: "BookingNumberEnabled", column_type: "boolean" },
//       { column_name: "Remarks", column_type: "nvarchar(1000)" },
//       { column_name: "RecordStatus", column_type: "int" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "CreatedBy", column_type: "nvarchar(100)" },
//       { column_name: "LastUpdate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "vessel declaration",
//   },
//   {
//     table: "BookingReport",
//     pk: "BookingReportId",
//     columns: [
//       { column_name: "BookingReportId", column_type: "int" },
//       { column_name: "BookingHeaderId", column_type: "int" },
//       { column_name: "RecordStatus", column_type: "int" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "CreatedBy", column_type: "nvarchar(100)" },
//       { column_name: "LastUpdate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "vessel declaration",
//   },
//   {
//     table: "ForecastDeclaration",
//     pk: "ForecastId",
//     columns: [
//       { column_name: "ForecastId", column_type: "int" },
//       { column_name: "CustomerId", column_type: "int" },
//       { column_name: "SeasonConfigurationId", column_type: "int" },
//       { column_name: "ForWeekFrom", column_type: "int" },
//       { column_name: "GroupId", column_type: "int" },
//       { column_name: "ForecastStatus", column_type: "int" },
//       { column_name: "RecordStatus", column_type: "int" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "ActualizationDate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "forecast declaration",
//   },
//   {
//     table: "ForecastDeclarationDate",
//     pk: "ForecastDeclarationDateId",
//     columns: [
//       { column_name: "ForecastDeclarationDateId", column_type: "int" },
//       { column_name: "SeasonConfigurationId", column_type: "int" },
//       { column_name: "TradeId", column_type: "int" },
//       { column_name: "CountryOfLoadingId", column_type: "int" },
//       { column_name: "PortOfLoadingId", column_type: "int" },
//       { column_name: "PortOfDischargeId", column_type: "int" },
//       { column_name: "WorkDate", column_type: "datetime" },
//       { column_name: "RecordStatus", column_type: "int" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "CreatedBy", column_type: "nvarchar(100)" },
//       { column_name: "LastUpdate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "forecast declaration",
//   },
//   {
//     table: "ForecastDeclarationItem",
//     pk: "ForecastDeclarationItemId",
//     columns: [
//       { column_name: "ForecastDeclarationItemId", column_type: "int" },
//       { column_name: "ForecastId", column_type: "int" },
//       { column_name: "TradeId", column_type: "int" },
//       { column_name: "MerchandiseId", column_type: "int" },
//       { column_name: "CountryOfLoadingId", column_type: "int" },
//       { column_name: "PortOfLoadingId", column_type: "int" },
//       { column_name: "PortOfDischargeId", column_type: "int" },
//       { column_name: "VoyageId", column_type: "int" },
//       { column_name: "PalletQty", column_type: "int" },
//       { column_name: "PalletStdQty", column_type: "decimal(189)" },
//       { column_name: "PalletTypeId", column_type: "int" },
//       { column_name: "TypeOfHold", column_type: "int" },
//       { column_name: "ContainerQty", column_type: "int" },
//       { column_name: "ContainerTypeId", column_type: "int" },
//       { column_name: "ForWeekTo", column_type: "int" },
//       { column_name: "WorkDate", column_type: "datetime" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "forecast declaration",
//   },
//   {
//     table: "SeasonDeclaration",
//     pk: "SeasonDeclarationId",
//     columns: [
//       { column_name: "SeasonDeclarationId", column_type: "int" },
//       { column_name: "SeasonConfigurationId", column_type: "int" },
//       { column_name: "CustomerId", column_type: "int" },
//       { column_name: "GroupId", column_type: "int" },
//       { column_name: "DeclarationStatus", column_type: "int" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "ActualizationDate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "season declaration",
//   },
//   {
//     table: "SeasonDeclarationItem",
//     pk: "SeasonDeclarationItemId",
//     columns: [
//       { column_name: "SeasonDeclarationItemId", column_type: "int" },
//       { column_name: "SeasonConfigurationId", column_type: "int" },
//       { column_name: "CustomerId", column_type: "int" },
//       { column_name: "GroupId", column_type: "int" },
//       { column_name: "TradeId", column_type: "int" },
//       { column_name: "PortOfLoadingId", column_type: "int" },
//       { column_name: "PortOfDischargeId", column_type: "int" },
//       { column_name: "MerchandiseId", column_type: "int" },
//       { column_name: "WeekNumber", column_type: "int" },
//       { column_name: "PalletsQty", column_type: "int" },
//       { column_name: "ContQty", column_type: "int" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "season declaration",
//   },
//   {
//     table: "Voyage",
//     pk: "VoyageID",
//     columns: [
//       { column_name: "VoyageID", column_type: "int" },
//       { column_name: "TradeId", column_type: "int" },
//       { column_name: "VesselId", column_type: "int" },
//       { column_name: "OperationalVoyageNumber", column_type: "nchar(20)" },
//       { column_name: "ComercialVoyageNumber", column_type: "nchar(20)" },
//       { column_name: "VoyageStatus", column_type: "nchar(2)" },
//       { column_name: "TypeOfVoyage", column_type: "int" },
//       { column_name: "PrincipalId", column_type: "int" },
//       { column_name: "Remarks", column_type: "nvarchar(2000)" },
//       { column_name: "RemarksBooking", column_type: "nvarchar(8000)" },
//       { column_name: "TotalPallets", column_type: "int" },
//       { column_name: "SlotsQty", column_type: "int" },
//       { column_name: "PlugsQty", column_type: "int" },
//       { column_name: "DeclarationWeek", column_type: "int" },
//       { column_name: "DeclarationDate", column_type: "datetime" },
//       { column_name: "DeadLineDate", column_type: "datetime" },
//       { column_name: "SeasonConfigurationId", column_type: "int" },
//       { column_name: "FeuQty", column_type: "int" },
//       { column_name: "TeuQty", column_type: "int" },
//       { column_name: "VesselCode", column_type: "nchar(8)" },
//       { column_name: "AccountVesselCode", column_type: "nchar(8)" },
//       { column_name: "AccountVoyageNumber", column_type: "nchar(10)" },
//       { column_name: "CountryOfficeId", column_type: "int" },
//       { column_name: "VoyageFinalCloseIndicator", column_type: "int" },
//       { column_name: "StatisticsPeriodDate", column_type: "datetime" },
//       { column_name: "ComercialVoyageNumberCharter", column_type: "nchar(30)" },
//       { column_name: "TransferVoyageNumber", column_type: "nchar(20)" },
//       { column_name: "DocumentalDeadLine", column_type: "datetime" },
//       { column_name: "NominationDate", column_type: "datetime" },
//       { column_name: "UpdatingDate", column_type: "datetime" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "ActualizationDate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "schedules",
//   },
//   {
//     table: "VoyageCall",
//     pk: "VoyageCallID",
//     columns: [
//       { column_name: "VoyageCallID", column_type: "int" },
//       { column_name: "VoyageCallFatherID", column_type: "int" },
//       { column_name: "VoyageId", column_type: "int" },
//       { column_name: "LocationId", column_type: "int" },
//       { column_name: "PortType", column_type: "int" },
//       { column_name: "PortStatus", column_type: "int" },
//       { column_name: "ComercialCallStatus", column_type: "int" },
//       { column_name: "OperationalCallStatus", column_type: "int" },
//       { column_name: "Remarks", column_type: "nvarchar(200)" },
//       { column_name: "DeadLine", column_type: "datetime" },
//       { column_name: "EstimatedVesselArrival", column_type: "datetime" },
//       { column_name: "ETATime", column_type: "int" },
//       { column_name: "ETAConfirmationFlg", column_type: "int" },
//       { column_name: "BeginOperations", column_type: "datetime" },
//       { column_name: "BeginOperationsTime", column_type: "int" },
//       { column_name: "EndOperations", column_type: "datetime" },
//       { column_name: "EndOperationsTime", column_type: "int" },
//       { column_name: "BeginOperationsUnderDeck", column_type: "datetime" },
//       { column_name: "BeginOperationsTimeUnderDeck", column_type: "int" },
//       { column_name: "EndOperationsUnderDeck", column_type: "datetime" },
//       { column_name: "EndOperationsTimeUnderDeck", column_type: "int" },
//       { column_name: "EstimatedBeginLoad", column_type: "datetime" },
//       { column_name: "EstimatedBeginLoadTime", column_type: "int" },
//       { column_name: "EstimatedVesselDeparture", column_type: "datetime" },
//       { column_name: "EstimatedVesselDepartureTime", column_type: "int" },
//       { column_name: "ActualVesselArrival", column_type: "datetime" },
//       { column_name: "ActualVesselArrivalTime", column_type: "int" },
//       { column_name: "TerminalId", column_type: "int" },
//       { column_name: "BerthId", column_type: "int" },
//       { column_name: "UnBerth", column_type: "datetime" },
//       { column_name: "UnberthTime", column_type: "int" },
//       { column_name: "PilotOnBoard", column_type: "datetime" },
//       { column_name: "PilotOnBoardTime", column_type: "int" },
//       { column_name: "FirstLine", column_type: "datetime" },
//       { column_name: "FirstLineTime", column_type: "int" },
//       { column_name: "StoppedLoadingFrom", column_type: "datetime" },
//       { column_name: "StoppedLoadingFromTime", column_type: "int" },
//       { column_name: "StoppedLoadingTo", column_type: "datetime" },
//       { column_name: "StoppedLoadingToTime", column_type: "int" },
//       { column_name: "AnchorageFrom", column_type: "datetime" },
//       { column_name: "AnchorageFromTime", column_type: "int" },
//       { column_name: "AnchorageTo", column_type: "datetime" },
//       { column_name: "AnchorageToTime", column_type: "int" },
//       { column_name: "BeginWork", column_type: "datetime" },
//       { column_name: "BeginWorkTime", column_type: "int" },
//       { column_name: "EndWork", column_type: "datetime" },
//       { column_name: "EndWorkTime", column_type: "int" },
//       { column_name: "DocumentalCutOffDate", column_type: "datetime" },
//       { column_name: "DocumentalCutOffDateBB", column_type: "datetime" },
//       {
//         column_name: "ShippingInstructionCutOffContainersDate",
//         column_type: "datetime",
//       },
//       {
//         column_name: "ShippingInstructionCutOffBreakBulkDateBreakBulk",
//         column_type: "datetime",
//       },
//       {
//         column_name: "BillOfLadingCutOffContainersDate",
//         column_type: "datetime",
//       },
//       {
//         column_name: "BillOfLadingCutOffBreakBulkDate",
//         column_type: "datetime",
//       },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "LastUpdate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "schedules",
//   },
//   {
//     table: "VoyageCallSpecialDate",
//     pk: "VoyageCallSpecialDateId",
//     columns: [
//       { column_name: "VoyageCallSpecialDateId", column_type: "int" },
//       { column_name: "VoyageCallID", column_type: "int" },
//       { column_name: "TypeOfDateId", column_type: "int" },
//       { column_name: "DateFrom", column_type: "datetime" },
//       { column_name: "DateTo", column_type: "datetime" },
//       { column_name: "CreationDate", column_type: "datetime" },
//       { column_name: "ActualizationDate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "schedules",
//   },
//   {
//     table: "VoyageParty",
//     pk: "VoyagePartyId",
//     columns: [
//       { column_name: "VoyagePartyId", column_type: "int" },
//       { column_name: "VoyageId", column_type: "int" },
//       { column_name: "PartyTypeId", column_type: "int" },
//       { column_name: "PartyId", column_type: "int" },
//       { column_name: "Creationdate", column_type: "datetime" },
//       { column_name: "LastUpdate", column_type: "datetime" },
//       { column_name: "UserName", column_type: "nvarchar(100)" },
//       { column_name: "created_at", column_type: "DATETIME" },
//       { column_name: "updated_at", column_type: "DATETIME" },
//     ],
//     source_id: "scsdoc_tables",
//     subsection: "schedules",
//   },
// ];