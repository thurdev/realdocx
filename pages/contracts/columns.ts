import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import type { Contract } from "./_contract";
import { ContractType, ContactsType } from "./_contract";
import DataTableDropdown from "./DataTableDropdown.vue";

const contractTypeLabels: Record<ContractType, string> = {
  [ContractType.buyOrSell]: "Compra e Venda",
  [ContractType.rent]: "Arrendamento",
};

export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "property",
    header: "Imóvel",
    cell: ({ row }) => {
      const property = row.original.property;
      return `${property.address}, ${property.number}, ${property.city}`;
    },
  },
  {
    accessorKey: "price",
    header: "Valor",
    cell: ({ row }) => {
      const price = row.original.price;
      const type = row.original.contractType;
      const formattedPrice = new Intl.NumberFormat("pt-PT", {
        style: "currency",
        currency: "EUR",
      }).format(price);

      if (type === ContractType.rent) {
        return `${formattedPrice}/mês`;
      }
      return formattedPrice;
    },
  },
  {
    accessorKey: "contractType",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.original.contractType;
      return type === ContractType.buyOrSell
        ? "Compra e Venda"
        : "Arrendamento";
    },
  },
  {
    accessorKey: "duration",
    header: "Duração",
    cell: ({ row }) => {
      const type = row.original.contractType;
      const duration = row.original.duration;

      if (type === ContractType.rent && duration) {
        return `${duration} meses`;
      }
      return "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data",
    cell: ({ row }) => {
      return new Date(row.original.createdAt ?? "").toLocaleDateString("pt-PT");
    },
  },
  {
    id: "seller",
    header: () => h("div", { class: "text-right" }, "Vendedor"),
    cell: ({ row }) => {
      const contact = row.original.contacts.find(
        (c) => c.contactType === ContactsType.seller
      )?.contacts;
      return h(
        "div",
        { class: "text-right font-medium" },
        contact?.name || "-"
      );
    },
  },
  {
    id: "buyer",
    header: () => h("div", { class: "text-right" }, "Comprador"),
    cell: ({ row }) => {
      const contact = row.original.contacts.find(
        (c) => c.contactType === ContactsType.buyer
      )?.contacts;
      return h(
        "div",
        { class: "text-right font-medium" },
        contact?.name || "-"
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
