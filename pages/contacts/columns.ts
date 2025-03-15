import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import type { Contact } from "./_contacts";
import DataTableDropdown from "./DataTableDropdown.vue";

export const createColumns = ($t: (key: string) => string): ColumnDef<Contact>[] => [
  {
    accessorKey: "id",
    header: () => h("div", { class: "text-right" }, "ID"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.id),
  },
  {
    accessorKey: "type",
    header: () => h("div", { class: "text-right" }, "Tipo"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.contactType),
  },
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-left" }, $t("cpcv.contacts.modals.form.inputs.name")),
    cell: ({ row }) =>
      h("div", { class: "text-left font-medium" }, row.original.name),
  },
  {
    accessorKey: "vat",
    header: () => h("div", { class: "text-left" }, $t("cpcv.contacts.modals.form.inputs.nif")),
    cell: ({ row }) => h("div", { class: "text-left font-medium" }, row.original.vat),
  },
  {
    accessorKey: "contactType",
    header: () => h("div", { class: "text-left" }, $t("cpcv.contacts.modals.contactType")),
    cell: ({ row }) => h("div", { class: "text-left font-medium" }, $t(`cpcv.contacts.modals.types.${row.original.contactType}`)),
  },
  {
    accessorKey: "country",
    header: () => h("div", { class: "text-right" }, "País"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.country),
  },
  {
    accessorKey: "address",
    header: () => h("div", { class: "text-right" }, "Morada"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.address),
  },
  {
    accessorKey: "createdAt",
    header: () => h("div", { class: "text-right" }, "Criado Em"),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-right font-medium" },
        row.original?.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "-"
      ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => h("div", { class: "text-right" }, $t("shared.actions")),
    cell: ({ row }) => {
      const contact = row.original;
      return h(
        "div",
        { class: "text-right" },
        h(DataTableDropdown, {
          contact,
        })
      );
    },
  },
];
