
// ---------------- Type Definitions which can be imported from ./RuntimeTypes -------------------------
export interface TableRegistrations extends BaseTableRegistrations {
    "voy_quote": voy_quote,
    "voy_quotelineitem": voy_quotelineitem,
}

export interface EnumRegistrations extends BaseEnumRegistrations {
    "voy_quote-statecode": voy_quote_statecode,
    "voy_quote-statuscode": voy_quote_statuscode,
    "voy_quotelineitem-statecode": voy_quotelineitem_statecode,
    "voy_quotelineitem-statuscode": voy_quotelineitem_statuscode,
}

export type voy_quote = TableRow<{
    // Primary Key Column
    readonly voy_quoteid: string,
    processid: string,
    statecode: voy_quote_statecode,
    statuscode: voy_quote_statuscode,
    voy_quoteidentifier: string,
        readonly exchangerate: number,
        // Foreign Key Column
        readonly _transactioncurrencyid_value: `/transactioncurrency(${string})`,
        // Foreign Key Column
        readonly _voy_currencyid_value: `/transactioncurrency(${string})`,
        // Foreign Key Column
        readonly _voy_customer_value: `/account(${string})` | `/contact(${string})`,
    voy_destination: string,
    voy_discountpercentage: number,
    voy_numberoftravelers: number,
    voy_quotenumber: string,
    voy_subtotal: number,
        readonly voy_subtotal_base: number,
    voy_total: number,
        readonly voy_total_base: number,
        // Foreign Key Column
        readonly _voy_travelinquiryid_value: `/voy_travelinquiry(${string})`,
    voy_validuntil: Date,
    voy_vat: number,
        readonly voy_vat_base: number,
}>
export type voy_quotelineitem = TableRow<{
    // Primary Key Column
    readonly voy_quotelineitemid: string,
    statecode: voy_quotelineitem_statecode,
    statuscode: voy_quotelineitem_statuscode,
    voy_name: string,
    voy_amount: number,
    voy_description: string,
        readonly voy_discountamount: number,
    voy_discountpercentage: number,
    voy_priceperunit: number,
        // Foreign Key Column
    _voy_quoteid_value: `/voy_quote(${string})`,
        readonly voy_total: number,
}>

const enum voy_quote_statecode {
"Active" = 0,
"Inactive" = 1,
}
const enum voy_quote_statuscode {
"Active" = 1,
"Inactive" = 2,
}
const enum voy_quotelineitem_statecode {
"Active" = 0,
"Inactive" = 1,
}
const enum voy_quotelineitem_statuscode {
"Active" = 1,
"Inactive" = 2,
}


/**
 * Possible scalar values of a data column in a data row.
 */
export type DataColumnValue = string | number | boolean | Date | null;

/**
 * Represents the type for the value of a primary key column, typically a string.
 */
export type RowKeyDataColumnValue = string;

/**
 * Represents the row of a table
 */
export interface DataRow {
  /**
   * A column can be a simple field value
   */
  [column: string]: DataColumnValue;
}

/**
 * Represents a table type with the given row typing
 */
export type TableRow<R extends DataRow = DataRow> = R;

/**
 * Represents a collection of rows for a table
 */
export interface DataTable<T> {
  rows: T[];
  hasMoreRows: boolean;
  loadMoreRows?: () => Promise<DataTable<T>>;
}

// Type equality check utility - leverages assignability of extends
// See https://stackoverflow.com/a/52473108 for detailed explanation
export type IfTypeEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? A
  : B;

export type ExcludeReadonly<T> =
  // For every property, we are checking if a type with just that property (whether readonly or writable) is assignable to a type which requires that property to be writable
  // If it does, then the property is inferred to be writable and is kept in the mapped keys
  // If not, it is removed from the mapped keys
  { [P in keyof T as IfTypeEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>]: T[P] };

/**
 * Extracts a sub-type with only the fields of the table (simple values, but not nav props)
 * @template T The original type representing a table row.
 * @template FieldType The base type for fields to extract (defaults to DataColumnValue).
 */
export type ExtractFields<T, FieldType = DataColumnValue> = {
  [K in keyof T as Required<T>[K] extends FieldType ? K : never]: T[K];
};

/**
 * Extracts the properties from type E that represent selectable scalar fields.
 * @template E The entity type.
 */
export type ExtractSelectable<E> = {
  // All simple value fields get included as the actual value
  [K in keyof ExtractFields<E, DataColumnValue>]: E[K];
};

/**
 * Extracts properties representing the OData formatted values for display purposes.
 * Creates properties like `<fieldName>@OData.Community.Display.V1.FormattedValue`.
 * @template E The entity type.
 */
export type ExtractReadonly<E> = {
  // For all field values, include a <prop-name>@OData.Community.Display.V1.FormattedValue string property that holds the formatted value of the field
  [K in keyof ExtractFields<E, DataColumnValue> as `${Extract<
    K,
    string
  >}@OData.Community.Display.V1.FormattedValue`]?: string;
};

/**
 * Retrieved record definition is projected from the defined typing structure for the table
 */
export type ReadableTableRow<E> = ExtractSelectable<E> & ExtractReadonly<E>;

/**
 * Writable record definition is projected from the defined typing structure for the table
 */
export type WritableTableRow<E extends TableRow> = {
  // All non readonly fields get included as the actual value type
  [K in keyof ExcludeReadonly<ExtractFields<E, DataColumnValue>>]: E[K];
};

/**
 * Base options for fetching row data, allowing selection of specific fields.
 * @template E The entity type extending TableRow.
 */
export interface FetchRowOptions<E extends TableRow> {
  /**
   * List of fields to select (not allowed to select from related)
   */
  select?: Array<keyof ExtractSelectable<E>>;
}

/**
 * Options for table query operation
 */
export interface QueryTableOptions<E extends TableRow> extends FetchRowOptions<E> {
  /**
   * Optionally specifies the page size for fetching records
   */
  pageSize?: number;
  /**
   * ODATA filter expression for the table
   */
  filter?: string;

  /**
   * ODATA orderby expression for the table
   */
  orderBy?: string;
}

/**
 * Options for fetching a single record operation
 */
export interface RetrieveRowOptions<E extends TableRow> extends FetchRowOptions<E> {
  /**
   * ID of the row
   */
  id: string;
}

/**
 * Base interface for table registrations. Specific implementations should extend this.
 */
export interface BaseTableRegistrations {
  [tableName: string]: TableRow;
}

/**
 * Base interface for enum registrations. Specific implementations should extend this.
 */
export interface BaseEnumRegistrations {
  [enumName: string]: number;
}

/**
 * Extract all available table names from a given TableRegistrations type
 * @template TR The type extending BaseTableRegistrations.
 * @template E The base entity type constraint (defaults to TableRow).
 */
export type TableName<TR extends BaseTableRegistrations, E extends TableRow = TableRow> = keyof {
  [K in keyof TR as TR[K] extends E ? K : never]: TR[K];
};

/**
 * Extracts all available enum names from a given EnumRegistrations type
 * @template ER The type extending BaseEnumRegistrations.
 */
export type EnumName<ER extends BaseEnumRegistrations> = keyof {
  [K in keyof ER as ER[K] extends number ? K : never]: ER[K];
};

/**
 * Represents a single choice for an enum, containing a display label and its corresponding value.
 * @template E The specific enum name.
 * @template ER The type extending BaseEnumRegistrations.
 */
export interface EnumChoice<E extends EnumName<ER>, ER extends BaseEnumRegistrations> {
  label: string;
  value: ER[E];
}

/**
 * Gets the table row type of a table given its name and optional TableRegistrations type
 * @template T The name of the table.
 * @template TR The type extending BaseTableRegistrations.
 */
export type RowOf<T extends TableName<TR>, TR extends BaseTableRegistrations> = TR[T];

/**
 * The input for a page, which may include an optional record ID, entity name, and additional data.
 */
export interface PageInput {
  recordId?: string;
  entityName?: string;
  data?: object;
}

/**
 * Represents the base interface for a UX Agent Data API, providing CRUD operations for table data
 * and retrieval of enum choices. This generic interface is designed to be extended for specific
 * table and enum registrations.
 *
 * @template TR - The type representing table registrations, mapping table names to their row types.
 * @template ER - The type representing enum registrations, mapping enum names to their value types.
 *
 * @interface
 */
export interface BaseUxAgentDataApi<TR extends BaseTableRegistrations, ER extends BaseEnumRegistrations> {
  /**
   * Creates a new row in the specified table.
   * @template T - The name of the table.
   * @param tableName - The name of the table to create the row in.
   * @param row - The data for the new row.
   * @returns A promise that resolves with the ID of the newly created row.
   */
  createRow<T extends keyof TR>(tableName: T, row: WritableTableRow<TR[T]>): Promise<RowKeyDataColumnValue>;
  /**
   * Updates an existing row in the specified table.
   * @template T - The name of the table.
   * @param tableName - The name of the table containing the row to update.
   * @param rowId - The ID of the row to update.
   * @param row - The updated data for the row.
   * @returns A promise that resolves when the update is complete.
   */
  updateRow<T extends keyof TR>(
    tableName: T,
    rowId: RowKeyDataColumnValue,
    row: WritableTableRow<TR[T]>
  ): Promise<void>;
  /**
   * Deletes a row from the specified table.
   * @template T - The name of the table.
   * @param tableName - The name of the table to delete the row from.
   * @param rowId - The ID of the row to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  deleteRow<T extends keyof TR>(tableName: T, rowId: RowKeyDataColumnValue): Promise<void>;
  /**
   * Retrieves a single row from the specified table based on the provided options.
   * @template T - The name of the table.
   * @param tableName - The name of the table to retrieve the row from.
   * @param options - The options for retrieving the row, including the row ID and selected fields.
   * @returns A promise that resolves with the retrieved row data.
   */
  retrieveRow<T extends keyof TR>(
    tableName: T,
    options: RetrieveRowOptions<TR[T]>
  ): Promise<ReadableTableRow<TR[T]>>;
  /**
   * Queries a table based on the specified options.
   * @template T - The name of the table.
   * @param tableName - The name of the table to query.
   * @param query - The query options, including select, filter, sorting and pagination settings.
   * @returns A promise that resolves with a DataTable containing the query results.
   */
  queryTable<T extends keyof TR>(
    tableName: T,
    query: QueryTableOptions<TR[T]>
  ): Promise<DataTable<ReadableTableRow<TR[T]>>>;
  /**
   * Retrieves the available choices for a specified enum.
   * @template E - The name of the enum.
   * @param enumName - The name of the enum to retrieve choices for.
   * @returns A promise that resolves with an array of enum choices, each containing a label and value.
   */
  getChoices<E extends EnumName<ER>>(enumName: E): Promise<Array<EnumChoice<E, ER>>>;
}

export interface UxAgentDataApi extends BaseUxAgentDataApi<TableRegistrations, EnumRegistrations> {}

export interface GeneratedComponentProps {
    dataApi: UxAgentDataApi;
    pageInput?: PageInput;
}
