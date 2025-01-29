<template>
  <div>
    <Card class="max-w-[512px]">
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          <h1>Lista de contatos</h1>
          <Button @click="dialogCreate = true">Adicionar Contato</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input />
      </CardContent>
    </Card>
  </div>

  <Dialog v-model:open="dialogCreate">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Contato</DialogTitle>
        <DialogDescription>
          Adicione um novo contato para a tua lista de contatos.
        </DialogDescription>
      </DialogHeader>

      <div class="flex gap-2">
        <div class="flex-1">
          <p>Informações Pessoais</p>
          <Label>Nome</Label>
          <Input label="Nome" />

          <Label>Freguesia</Label>
          <Input label="freguesia" />

          <Label>Concelho</Label>
          <Input label="Concelho" />

          <Label>NIF</Label>
          <Input label="NIF" />

          <Label>Cartão Cidadão</Label>
          <Input label="Cartão Cidadão" />

          <Label>Cartão Cidadão Data de Validade</Label>
          <Input label="Cartão Cidadão Data de Validade" />

          <Label>Estado Civil</Label>
          <Input label="Estado Civil" />

          <Label>Casado sob regime</Label>
          <Input label="Casado sob regime" />

          <Label>Casado com domicilio</Label>
          <Input label="Casado com domicilio" />
        </div>

        <div class="flex-1">
          <p>Informações Profissionais</p>
          <Label>Matricula Comercial</Label>
          <Input label="Matricula Comercial" />

          <Label>Certidao Permanente</Label>
          <Input label="Certidao Permanente" />

          <Label>Codigo RCBE</Label>
          <Input label="Codigo RCBE" />

          <Label>Sede RCBE</Label>
          <Input label="Sede RCBE" />

          <Label>Capital Social</Label>
          <Input label="Capital Social" />

          <Label>Acto</Label>
          <Input label="Acto" />
        </div>
      </div>

      <DialogFooter> <Button>Salvar</Button> </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "authenticated",
  middleware: "authenticated",
});

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const dialogCreate = ref(false);
</script>
