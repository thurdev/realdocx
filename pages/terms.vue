<template>
  <div class="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-8 md:p-12">
        <!-- Cabeçalho -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Termos de Uso
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Última atualização: {{ new Date().toLocaleDateString('pt-PT') }}
          </p>
        </div>

        <!-- Conteúdo -->
        <div class="space-y-8 text-gray-600 dark:text-gray-300">
          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao aceder e utilizar o RealDOCX, você concorda com estes termos de uso. 
              Se não concordar com alguma parte destes termos, não poderá utilizar nossos serviços.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Descrição do Serviço
            </h2>
            <p class="mb-4">
              O RealDOCX é uma plataforma de gestão imobiliária que oferece:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Gestão de contratos e documentos</li>
              <li>Gestão de propriedades</li>
              <li>Gestão de contactos</li>
              <li>Ferramentas de automação</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Conta de Utilizador
            </h2>
            <p class="mb-4">
              Para utilizar nossos serviços, você deve:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Criar uma conta com informações precisas e atualizadas</li>
              <li>Manter a segurança de suas credenciais de acesso</li>
              <li>Ser responsável por todas as atividades em sua conta</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Pagamentos e Reembolsos
            </h2>
            <p class="mb-4">
              Ao subscrever um plano pago:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Você concorda com os preços e condições do plano escolhido</li>
              <li>Os pagamentos são processados mensalmente</li>
              <li>Reembolsos podem ser solicitados em até 14 dias após a subscrição</li>
              <li>Cancelamentos podem ser feitos a qualquer momento</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Propriedade Intelectual
            </h2>
            <p>
              Todo o conteúdo e software do RealDOCX são protegidos por direitos autorais e outras leis de propriedade intelectual.
              Você não pode copiar, modificar, distribuir ou criar trabalhos derivados de nosso conteúdo sem autorização expressa.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Limitação de Responsabilidade
            </h2>
            <p>
              O RealDOCX é fornecido "como está" e não oferecemos garantias expressas ou implícitas.
              Não nos responsabilizamos por danos diretos, indiretos, incidentais ou consequentes resultantes do uso do serviço.
            </p>
          </section>
        </div>

        <!-- Rodapé -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-gray-600 dark:text-gray-400 text-center">
            Para dúvidas sobre os termos, entre em contato: legal@realdocx.com
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