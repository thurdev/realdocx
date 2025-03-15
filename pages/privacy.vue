<template>
  <div class="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-8 md:p-12">
        <!-- Cabeçalho -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Política de Privacidade
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Última atualização: {{ new Date().toLocaleDateString('pt-PT') }}
          </p>
        </div>

        <!-- Conteúdo -->
        <div class="space-y-8 text-gray-600 dark:text-gray-300">
          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Informações que Coletamos
            </h2>
            <p class="mb-4">
              Coletamos informações que você nos fornece diretamente ao utilizar nossos serviços:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Informações de conta (email, senha)</li>
              <li>Dados de perfil e empresa</li>
              <li>Informações de contratos e documentos</li>
              <li>Dados de contatos e propriedades</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Como Utilizamos suas Informações
            </h2>
            <p class="mb-4">
              Utilizamos as informações coletadas para:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Processar suas transações</li>
              <li>Enviar notificações importantes</li>
              <li>Prevenir fraudes e abusos</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Compartilhamento de Informações
            </h2>
            <p>
              Não vendemos suas informações pessoais. Compartilhamos suas informações apenas:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Com seu consentimento</li>
              <li>Com prestadores de serviços que nos auxiliam</li>
              <li>Quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Segurança
            </h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações. 
              No entanto, nenhum sistema é 100% seguro, e não podemos garantir a segurança absoluta de suas informações.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Seus Direitos
            </h2>
            <p class="mb-4">
              Você tem direito a:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados imprecisos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Exportar seus dados</li>
            </ul>
          </section>
        </div>

        <!-- Rodapé -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-gray-600 dark:text-gray-400 text-center">
            Para questões sobre privacidade, entre em contato: privacy@realdocx.com
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script> 