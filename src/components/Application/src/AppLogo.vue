<template>
  <div class="anticon" :class="getAppLogoClass">
    <img src="../../../assets/logo.png" alt="" srcset="" />
    <div class="ml-2 truncate md:opacity-100" :class="getTitleClass" v-show="showTitle">
      {{ title }}</div
    >
  </div>
</template>

<script setup lang="ts">
  import { computed, unref } from 'vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useUserStore } from '@/store/modules/user';
  import { useGlobSetting } from '@/hooks/setting';

  const props = defineProps({
    // AppLogo父组件的主题
    theme: { type: String, validator: (v: string) => ['light', 'dark'].includes(v) },
    // 是否显示标题文字
    showTitle: { type: Boolean, default: true },
    // 菜单折叠时也显示标题文字
    alwaysShowTitle: { type: Boolean },
  });

  const { prefixCls } = useDesign('app-logo');
  const { title } = useGlobSetting();

  // 折叠菜单时是否显示标题文字
  const { getCollapsedShowTitle } = useMenuSetting();
  const userStore = useUserStore();

  const getAppLogoClass = computed(() => [
    prefixCls,
    props.theme, //主题跟随头部主题
    { 'collapsed-show-title': unref(getCollapsedShowTitle) },
  ]);

  const getTitleClass = computed(() => [
    `${prefixCls}__title`,
    {
      'xs:opacity-0': !props.alwaysShowTitle,
    },
  ]);
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    padding-left: 7px;
    cursor: pointer;
    transition: all 0.2s ease;

    &.light {
      border-bottom: 1px solid @border-color-base;
    }

    &.collapsed-show-title {
      padding-left: 20px;
    }

    &.light &__title {
      color: @primary-color;
    }

    &.dark &__title {
      color: @white;
    }

    &__title {
      font-size: 16px;
      font-weight: 700;
      transition: all 0.5s;
      line-height: normal;
    }
  }
</style>
