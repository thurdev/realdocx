import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import type { Property } from "./_property";
import DataTableDropdown from "./DataTableDropdown.vue";

export const createColumns = (
  $t: (key: string) => string
): ColumnDef<Property>[] => [
  {
    accessorKey: "image",
    header: () => h("div", { class: "text-center" }, "Imagem"),
    cell: ({ row }) =>
      h("div", { class: "flex justify-center" }, [
        h("img", {
          src:
            row.original.image ||
            "https://saterdesign.com/cdn/shop/products/property-placeholder_a9ec7710-1f1e-4654-9893-28c34e3b6399.jpg?v=1500393334",
          class: "w-32 h-32 rounded-lg object-cover",
          alt: "Property image",
        }),
      ]),
  },
  {
    accessorKey: "id",
    header: () => h("div", { class: "text-right" }, "ID"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.id ?? "-"),
  },
  {
    accessorKey: "fraction",
    header: () =>
      h(
        "div",
        { class: "text-right" },
        $t("properties.inputs.fraction") ?? "-"
      ),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-right font-medium" },
        row.original.fraction ?? "-"
      ),
  },
  {
    accessorKey: "floor",
    header: () =>
      h("div", { class: "text-right" }, $t("properties.inputs.floor") ?? "-"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.floor ?? "-"),
  },
  {
    accessorKey: "country",
    header: () =>
      h("div", { class: "text-right" }, $t("properties.inputs.country") ?? "-"),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-right font-medium" },
        row.original.country ?? "-"
      ),
  },
  {
    accessorKey: "district",
    header: () =>
      h(
        "div",
        { class: "text-right" },
        $t("properties.inputs.district") ?? "-"
      ),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-right font-medium" },
        row.original.district ?? "-"
      ),
  },
  {
    accessorKey: "city",
    header: () =>
      h("div", { class: "text-right" }, $t("properties.inputs.city") ?? "-"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.original.city ?? "-"),
  },
  {
    accessorKey: "address",
    header: () =>
      h("div", { class: "text-right" }, $t("properties.inputs.address") ?? "-"),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-right font-medium" },
        row.original.address ?? "-"
      ),
  },
  {
    accessorKey: "postalCode",
    header: () =>
      h(
        "div",
        { class: "text-right" },
        $t("properties.inputs.postalCode") ?? "-"
      ),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-right font-medium" },
        row.original.postalCode ?? "-"
      ),
  },
  {
    accessorKey: "createdAt",
    header: () =>
      h("div", { class: "text-right" }, $t("shared.createdAt") ?? "-"),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-right font-medium" },
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "-"
      ),
  },
  {
    id: "actions",
    header: () => h("div", { class: "text-right" }, $t("shared.actions.title")),
    cell: ({ row }) => h(DataTableDropdown, { row: row.original }),
  },
];
