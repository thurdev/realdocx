import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import type { Property } from "./_property";
import DataTableDropdown from "./DataTableDropdown.vue";

export const createColumns = ($t: (key: string) => string): ColumnDef<Property>[] => [
  {
    accessorKey: "id",
    header: () => h("div", { class: "text-right" }, "ID"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.id),
  },
  {
    accessorKey: "fraction",
    header: () => h("div", { class: "text-right" }, $t("properties.inputs.fraction")),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.fraction),
  },
  {
    accessorKey: "floor",
    header: () => h("div", { class: "text-right" }, $t("properties.inputs.floor")),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.floor),
  },
  {
    accessorKey: "address",
    header: () => h("div", { class: "text-right" }, $t("properties.inputs.address")),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, `${row.original.address}, ${row.original.number}`),
  },
  {
    accessorKey: "district",
    header: () => h("div", { class: "text-right" }, $t("properties.inputs.district")),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.district),
  },
  {
    accessorKey: "city",
    header: () => h("div", { class: "text-right" }, $t("properties.inputs.city")),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.city),
  },
  {
    accessorKey: "postalCode",
    header: () => h("div", { class: "text-right" }, $t("properties.inputs.postalCode")),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.postalCode),
  },
  {
    accessorKey: "createdAt",
    header: () => h("div", { class: "text-right" }, $t("shared.createdAt")),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : "-"),
  },
  {
    id: "actions",
    header: () => h("div", { class: "text-right" }, $t("shared.actions.title")),
    cell: ({ row }) => h(DataTableDropdown, { row: row.original }),
  },
];
