import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import type { Contract } from "./_contract";
import { ContractType, ContactsType } from "./_contract";
import DataTableDropdown from "./DataTableDropdown.vue";

const contractTypeLabels: Record<ContractType, string> = {
  [ContractType.buyOrSell]: "Compra e Venda",
  [ContractType.rent]: "Arrendamento"
};

export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: "id",
    header: () => h("div", { class: "text-right" }, "ID"),
    cell: ({ row }) =>
      h("div", { class: "text-right font-medium" }, row.getValue("id")),
  },
  {
    accessorKey: "contractType",
    header: () => h("div", { class: "text-right" }, "Tipo"),
    cell: ({ row }) => {
      const type = row.getValue("contractType") as ContractType;
      return h("div", { class: "text-right font-medium" }, contractTypeLabels[type] || "-");
    }
  },
  {
    id: "seller",
    header: () => h("div", { class: "text-right" }, "Vendedor"),
    cell: ({ row }) => {
      const contact = row.original.contacts.find(
        c => c.contactType === ContactsType.seller
      )?.contacts;
      return h("div", { class: "text-right font-medium" }, contact?.name || "-");
    },
  },
  {
    id: "buyer",
    header: () => h("div", { class: "text-right" }, "Comprador"),
    cell: ({ row }) => {
      const contact = row.original.contacts.find(
        c => c.contactType === ContactsType.buyer
      )?.contacts;
      return h("div", { class: "text-right font-medium" }, contact?.name || "-");
    },
  },
  {
    id: "property",
    header: () => h("div", { class: "text-right" }, "Imóvel"),
    cell: ({ row }) => {
      const property = row.original.property;
      return h(
        "div",
        { class: "text-right font-medium" },
        property ? `${property.address || ''}, ${property.number || ''}` : "-"
      );
    },
  },
  {
    id: "price",
    header: () => h("div", { class: "text-right" }, "Valor"),
    cell: ({ row }) => {
      const price = row.original.price;
      return h(
        "div",
        { class: "text-right font-medium" },
        price ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price) : "-"
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => h("div", { class: "text-right" }, "Actions"),
    cell: ({ row }) => {
      const contract = row.original;

      return h(
        "div",
        { class: "text-right" },
        h(DataTableDropdown, {
          contract,
        })
      );
    },
  },
]; 