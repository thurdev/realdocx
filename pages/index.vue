<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div class="container mx-auto px-6 py-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <h1 class="text-4xl md:text-6xl font-bold leading-tight">
              {{ $t('landing.hero.title') }}
            </h1>
            <p class="text-xl text-blue-100">
              {{ $t('landing.hero.subtitle') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink to="/register" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center">
                {{ $t('landing.hero.cta.start') }}
              </NuxtLink>
            </div>
          </div>
          <div class="hidden md:block">
            <img src="/hero-image.svg" alt="Platform Preview" class="w-full" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-gray-50">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
            {{ $t('landing.features.title') }}
          </h2>
          <p class="mt-4 text-xl text-gray-600">
            {{ $t('landing.features.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Feature 1 -->
          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ $t('landing.features.contracts.title') }}
            </h3>
            <p class="text-gray-600">
              {{ $t('landing.features.contracts.description') }}
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ $t('landing.features.properties.title') }}
            </h3>
            <p class="text-gray-600">
              {{ $t('landing.features.properties.description') }}
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ $t('landing.features.contacts.title') }}
            </h3>
            <p class="text-gray-600">
              {{ $t('landing.features.contacts.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-24">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
            {{ $t('landing.pricing.title') }}
          </h2>
          <p class="mt-4 text-xl text-gray-600">
            {{ $t('landing.pricing.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <!-- Basic Plan -->
          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('landing.pricing.basic.title') }}</h3>
            <div class="mb-6">
              <span class="text-4xl font-bold">€89</span>
              <span class="text-gray-600">/mês</span>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ $t('landing.pricing.basic.features.contracts') }}
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ $t('landing.pricing.basic.features.contacts') }}
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ $t('landing.pricing.basic.features.support') }}
              </li>
            </ul>
            <NuxtLink to="/register" class="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {{ $t('landing.pricing.cta') }}
            </NuxtLink>
          </div>

          <!-- Pro Plan -->
          <div class="bg-blue-600 p-8 rounded-xl shadow-lg scale-105 transform">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-green-500 text-white text-sm px-3 py-1 rounded-full">{{ $t('landing.pricing.pro.badge') }}</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">{{ $t('landing.pricing.pro.title') }}</h3>
            <div class="mb-6">
              <span class="text-4xl font-bold text-white">€179</span>
              <span class="text-blue-200">/mês</span>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center text-white">
                <svg class="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ $t('landing.pricing.pro.features.contracts') }}
              </li>
              <li class="flex items-center text-white">
                <svg class="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ $t('landing.pricing.pro.features.management') }}
              </li>
              <li class="flex items-center text-white">
                <svg class="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ $t('landing.pricing.pro.features.support') }}
              </li>
            </ul>
            <NuxtLink to="/register" class="block w-full text-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              {{ $t('landing.pricing.cta') }}
            </NuxtLink>
          </div>

          <!-- Enterprise Plan -->
          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('landing.pricing.enterprise.title') }}</h3>
            <div class="mb-6">
              <span class="text-4xl font-bold">€359</span>
              <span class="text-gray-600">/mês</span>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ $t('landing.pricing.enterprise.features.contracts') }}
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ $t('landing.pricing.enterprise.features.api') }}
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ $t('landing.pricing.enterprise.features.support') }}
              </li>
            </ul>
            <NuxtLink to="/register" class="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {{ $t('landing.pricing.cta') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gray-900 text-white py-24">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-8">
          {{ $t('landing.cta.title') }}
        </h2>
        <p class="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          {{ $t('landing.cta.subtitle') }}
        </p>
        <div class="flex justify-center">
          <NuxtLink to="/register" class="bg-blue-600 text-white px-12 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-xl">
            {{ $t('landing.cta.buttons.create') }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Você pode adicionar qualquer lógica necessária aqui
</script>
