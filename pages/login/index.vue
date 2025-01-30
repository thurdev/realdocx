<template>
  <div class="flex">
    <div class="w-[100dvw] h-[100dvh] flex-1 bg-blue-500 hidden md:block">
      <spline-viewer
        url="https://prod.spline.design/1mgfaRIMYrLoSAqP/scene.splinecode"
      ></spline-viewer>
    </div>
    <div
      class="w-[100dvw] h-[100dvh] flex-1 bg-white dark:bg-zinc-950 flex items-center justify-center flex-col gap-4"
    >
      <h1
        class="text-black text-[48px] dark:text-white font-bold flex items-center justify-center gap-4"
      >
        <i class="fal fa-building"></i>
        Real<label class="text-blue-500">DOCX</label>
      </h1>
      <Input
        class="max-w-[342px]"
        type="email"
        placeholder="Email..."
        v-model="email"
      />
      <Input
        class="max-w-[342px]"
        type="password"
        placeholder="Palavra-passe..."
        v-model="password"
        @keydown.enter="handleLogin"
      />
      <Button
        class="w-full max-w-[342px] !bg-blue-500 hover:!bg-blue-600 dark:text-white"
        @click="handleLogin"
        :disabled="!canSubmit"
      >
        <i class="fal fa-sign-in-alt"></i>
        Entrar
      </Button>
      <p class="text-sm dark:text-white">Ou</p>
      <GoogleSignInButton
        @success="handleGoogleLoginSuccess"
        @error="handleGoogleLoginError"
      ></GoogleSignInButton>

      <small class="dark:text-white"
        >Ainda não tens conta?
        <NuxtLink to="/register" class="hover:underline"
          >Registar</NuxtLink
        ></small
      >
      <div class="dark:text-white absolute bottom-[8px] flex gap-2">
        <p>Política de privacidade</p>
        <p>|</p>
        <p>Termos de Uso</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "redirect-loggedin",
});

import {
  GoogleSignInButton,
  useOneTap,
  decodeCredential,
  type CredentialResponse,
} from "vue3-google-signin";

import { useToast } from "@/components/ui/toast/use-toast";

const { toast } = useToast();
const { $t } = useNuxtApp();

// Refs
const email = ref("");
const password = ref("");

// Computeds
const canSubmit = computed(() => email.value && password.value);

// Methods
const handleLogin = async () => {
  const response = await $fetch<string>("/api/auth/", {
    method: "POST",
    body: JSON.stringify({ email: email.value, password: password.value }),
  }).catch((err) => err.response);

  let alertType: "success" | "errors" = "errors";
  if (response.includes("success")) {
    alertType = "success";
    setTimeout(() => (window.location.href = "/cpcv/contacts"), 2000);
  }

  toast({
    title: $t(`endpoints.${alertType}.label`),
    description: $t(response),
    variant: alertType,
  });
};

const oAuthGoogle = async (credential?: string) => {
  if (credential) {
    const decodedUser = decodeCredential(credential);
    const authResponse = await $fetch<string>("/api/auth/google", {
      method: "POST",
      body: {
        ...decodedUser,
        credential,
      },
    }).catch((err) => err.response);

    toast({
      title: $t(`endpoints.success.label`),
      description: $t(authResponse),
      variant: "success",
    });
    setTimeout(() => (window.location.href = "/cpcv/contacts"), 2000);
  } else {
    toast({
      title: $t(`endpoints.errors.label`),
      description: $t("endpoints.errors.auth.googleAuth"),
      variant: "errors",
    });
  }
};

// Google
useOneTap({
  onSuccess: (response: CredentialResponse) => {
    const { credential } = response;
    oAuthGoogle(credential);
  },
  onError: () =>
    toast({
      title: $t(`endpoints.errors.label`),
      description: $t("endpoints.errors.auth.googleAuth"),
      variant: "errors",
    }),
  // options
});

// handle success event
const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;
  oAuthGoogle(credential);
};

// handle an error event
const handleGoogleLoginError = () => {
  toast({
    title: $t(`endpoints.errors.label`),
    description: $t("endpoints.errors.auth.googleAuth"),
    variant: "errors",
  });
};
</script>
