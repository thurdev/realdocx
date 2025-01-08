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

        <Label>Nome</Label>
        <Input label="Nome" />

        <Label>Email</Label>
        <Input label="Email" />
      </DialogHeader>

      <DialogFooter> Salvar </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
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
