<template>
  <div class="flex">
    <div class="w-[100dvw] h-[100dvh] flex-1 bg-blue-500 hidden md:block">
      <spline-viewer
        url="https://prod.spline.design/1mgfaRIMYrLoSAqP/scene.splinecode"
      ></spline-viewer>
    </div>
    <div
      class="w-[100dvw] h-[100dvh] flex-1 bg-white dark:bg-zinc-950 flex items-center justify-center"
    >
      <div class="w-full max-w-md px-8 py-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg space-y-8">
        <!-- Logo e Título -->
        <div class="text-center space-y-2">
          <h1 class="text-black text-[48px] dark:text-white font-bold flex items-center justify-center gap-4">
            <i class="fal fa-building"></i>
            Real<label class="text-blue-500">DOCX</label>
          </h1>
          <p class="text-gray-600 dark:text-gray-400">Crie sua conta gratuita e comece agora mesmo.</p>
        </div>

        <!-- Formulário -->
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fal fa-envelope text-gray-400"></i>
              </div>
              <Input
                class="w-full pl-10"
                type="email"
                placeholder="Seu email..."
                v-model="email"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Palavra-passe</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fal fa-lock text-gray-400"></i>
              </div>
              <Input
                class="w-full pl-10"
                type="password"
                placeholder="Sua palavra-passe..."
                v-model="password"
                @keydown.enter="handleRegister"
              />
            </div>
          </div>

          <Button
            class="w-full !bg-blue-500 hover:!bg-blue-600 dark:text-white h-11 text-base"
            @click="handleRegister"
            :disabled="!canSubmit"
          >
            <i class="fal fa-user-plus mr-2"></i>
            Criar Conta
          </Button>
        </div>

        <!-- Separador -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-zinc-900 text-gray-500">Ou continue com</span>
          </div>
        </div>

        <!-- Google Sign In -->
        <div class="flex justify-center">
          <GoogleSignInButton
            @success="handleGoogleLoginSuccess"
            @error="handleGoogleLoginError"
          ></GoogleSignInButton>
        </div>

        <!-- Links -->
        <div class="space-y-4 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?
            <NuxtLink to="/login" class="text-blue-500 hover:text-blue-600 font-medium">
              Entrar
            </NuxtLink>
          </p>

          <div class="text-xs text-gray-500 dark:text-gray-400 flex justify-center gap-4">
            <NuxtLink to="/privacy" class="hover:text-gray-700 dark:hover:text-gray-300">
              Política de privacidade
            </NuxtLink>
            <NuxtLink to="/terms" class="hover:text-gray-700 dark:hover:text-gray-300">
              Termos de Uso
            </NuxtLink>
          </div>
        </div>
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
    setTimeout(() => (window.location.href = "/contacts"), 2000);
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
    setTimeout(() => (window.location.href = "/contacts"), 2000);
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
