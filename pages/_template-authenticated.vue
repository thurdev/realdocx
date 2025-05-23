<template>
  <div></div>
</template>

<script setup lang="ts">
const router = useRouter();
const { loggedIn } = useUserSession();

if (loggedIn.value) {
  router.push("/dashboard/orders");
} else {
  router.push("/login");
}
</script>
