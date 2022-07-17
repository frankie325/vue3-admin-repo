<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <AppLocalePicker
      v-if="showLocale"
      class="absolute text-black top-4 right-4 enter-x xl:text-gray-600"
      :showText="false"
    ></AppLocalePicker>

    <AppDarkModeToggle class="absolute top-3 right-10 enter-x" />

    <div class="container mx-auto h-full py-2 sm:py-10">
      <div class="flex h-full">
        <div></div>
        <div class="flex w-full h-full">
          <div
            :class="`${prefixCls}-form`"
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

  import { useDesign } from '@/hooks/web/useDesign';
  import { useLocaleStore } from '@/store/modules/locale';
  const { prefixCls } = useDesign('login');

  const localeStore = useLocaleStore();
  const showLocale = localeStore.getShowPicker;
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
      .ant-input,
      .ant-input-password {
        background-color: #232a3b;
      }

      .ant-btn:not(.ant-btn-link):not(.ant-btn-primary) {
        border: 1px solid #4a5569;
      }

      &-form {
        background: transparent !important;
      }
    }

    input.fix-auto-fill,
    .fix-auto-fill input {
      // 修改placeholder颜色
      -webkit-text-fill-color: #c9d1d9 !important;
      box-shadow: inherit !important;
    }
  }

  .@{prefix-cls}{
    min-height: 100%;
    overflow: hidden;

    .ant-divider-inner-text {
      font-size: 12px;
      color: @text-color-secondary;
    }


    &-sign-in-way {
      .anticon {
        font-size: 22px;
        color: #888;
        cursor: pointer;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>
