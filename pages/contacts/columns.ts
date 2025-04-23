import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import type { Contact } from "./_contacts";
import DataTableDropdown from "./DataTableDropdown.vue";

export const createColumns = (
  $t: (key: string) => string
): ColumnDef<Contact>[] => [
  {
    accessorKey: "image",
    header: () => h("div", { class: "text-center" }, "Imagem"),
    cell: ({ row }) =>
      h("div", { class: "flex justify-center" }, [
        h("img", {
          src:
            row.original.image ||
            "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
          class: "min-w-16 min-h-16 w-16 h-16 rounded-lg object-cover",
          alt: "Contact image",
        }),
      ]),
  },
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
    header: () =>
      h(
        "div",
        { class: "text-left" },
        $t("cpcv.contacts.modals.form.inputs.name")
      ),
    cell: ({ row }) =>
      h("div", { class: "text-left font-medium" }, row.original.name),
  },
  {
    accessorKey: "vat",
    header: () =>
      h(
        "div",
        { class: "text-left" },
        $t("cpcv.contacts.modals.form.inputs.nif")
      ),
    cell: ({ row }) =>
      h("div", { class: "text-left font-medium" }, row.original.vat),
  },
  {
    accessorKey: "contactType",
    header: () =>
      h("div", { class: "text-left" }, $t("cpcv.contacts.modals.contactType")),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-left font-medium" },
        $t(`cpcv.contacts.modals.types.${row.original.contactType}`)
      ),
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
