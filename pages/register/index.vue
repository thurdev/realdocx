<template>
  <div class="flex">
    <div class="w-[100dvw] h-[100dvh] flex-1 bg-blue-500 hidden md:block">
      <spline-viewer
        url="https://prod.spline.design/1mgfaRIMYrLoSAqP/scene.splinecode"
      ></spline-viewer>
    </div>
    <div
      class="w-[100dvw] h-[100dvh] flex-1 bg-white flex items-center justify-center flex-col gap-4"
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
        @keydown.enter="handleRegister"
      />
      <Button
        class="w-full max-w-[342px]"
        @click="handleRegister"
        :disabled="!canSubmit"
      >
        <i class="fal fa-sign-in-alt"></i>
        Registar
      </Button>
      <p class="text-sm">Ou</p>
      <GoogleSignInButton
        @success="handleGoogleLoginSuccess"
        @error="handleGoogleLoginError"
      ></GoogleSignInButton>

      <small
        >Já tens conta?
        <NuxtLink to="/login" class="hover:underline">Entrar</NuxtLink></small
      >
      <div class="absolute bottom-[8px] flex gap-2">
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
const handleRegister = async () => {
  const response = await $fetch<string>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email: email.value, password: password.value }),
  }).catch((err) => err.response);

  let alertType: "success" | "errors" = "errors";

  if (response.includes("success")) {
    alertType = "success";
    setTimeout(() => (window.location.href = "/dashboard"), 2000);
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
      body: JSON.stringify({
        ...decodedUser,
        credential,
      }),
    }).catch((err) => err.response);

    toast({
      title: $t(`endpoints.success.label`),
      description: $t(authResponse),
      variant: "success",
    });
    setTimeout(() => (window.location.href = "/dashboard"), 2000);
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
