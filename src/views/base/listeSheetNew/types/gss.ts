export interface ColumnDefinition {
  [key: string]: string;
}

export interface GSSColumns {
  [sheetName: string]: ColumnDefinition;
}

export interface SheetFormData {
  sheetName: string;
  columns: { name: string; value: string }[];
}