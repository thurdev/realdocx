<template>
  <div class="flex items-center justify-center w-full h-full">
    <!-- Login  center page -->
    <div
      class="w-[400px] bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4 dark:bg-zinc-950 dark:text-white"
    >
      <div class="flex items-center justify-center">
        <label class="text-2xl font-bold text-blue-500">Login</label>
      </div>
      <div class="">
        <Label> Email </Label>
        <Input type="email" placeholder="Email" class="!outline-none" />
      </div>
      <div class="">
        <Label> Password </Label>
        <Input type="password" placeholder="Password" />
      </div>
      <div class="flex flex-col justify-center items-center gap-2">
        <Button variant="primary" class="w-full"> Login </Button>
        or
        <NuxtLink to="/register" class="w-full hover:underline text-center">
          Register
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup></script>
