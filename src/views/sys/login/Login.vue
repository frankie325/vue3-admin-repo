<template>
  <div class="relative w-full h-full px-4">
    <AppLocalePicker
      class="absolute text-black top-4 right-4 enter-x xl:text-gray-600"
    ></AppLocalePicker>

    <AppDarkModeToggle />
    <div class="container mx-auto h-full py-2 sm:py-10">
      <div class="flex h-full">
        <div></div>
        <div class="flex w-full h-full">
          <div
            class="relative w-full mx-auto my-auto px-5 py-8 rounded-md shadow-lg sm:w-2/4 lg:w-2/5 xl:w-1/3 enter-x"
          >
            <LoginForm />
            <ForgetPasswordForm />
            <MobileForm />
            <QrcodeForm />
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { AppLocalePicker } from '@/components/Application';
  import { AppDarkModeToggle } from '@/components/Application';
  import LoginForm from './LoginForm.vue';
  import ForgetPasswordForm from './ForgetPasswordForm.vue';
  import MobileForm from './MobileForm.vue';
  import QrcodeForm from './QrcodeForm.vue';
  import RegisterForm from './RegisterForm.vue';
</script>
