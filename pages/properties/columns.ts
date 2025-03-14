import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import type { Property } from "./_property";
import DataTableDropdown from "./DataTableDropdown.vue";

export const columns: ColumnDef<Property>[] = [
  {
    accessorKey: "id",
    header: () => h("div", { class: "text-right" }, "ID"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.id),
  },
  {
    accessorKey: "district",
    header: () => h("div", { class: "text-right" }, "Distrito"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.district),
  },

  {
    accessorKey: "city",
    header: () => h("div", { class: "text-right" }, "Cidade"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.city),
  },

  {
    accessorKey: "neighborhood",
    header: () => h("div", { class: "text-right" }, "Vizinhança"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.neighborhood),
  },

  {
    accessorKey: "address",
    header: () => h("div", { class: "text-right" }, "Morada"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.address),
  },

  {
    accessorKey: "number",
    header: () => h("div", { class: "text-right" }, "Número"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.number),
  },

  {
    accessorKey: "postalCode",
    header: () => h("div", { class: "text-right" }, "Código Postal"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.postalCode),
  },

  {
    accessorKey: "createdAt",
    header: () => h("div", { class: "text-right" }, "Criado em"),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-right font-medium" },
        new Date(row.original.createdAt).toLocaleDateString()
      ),
  },

  {
    id: "actions",
    enableHiding: false,
    header: () => h("div", { class: "text-right" }, "Actions"),
    cell: ({ row }) => {
      const property = row.original;

      return h(
        "div",
        { class: "text-right" },
        h(DataTableDropdown, {
          property,
        })
      );
    },
  },
];
