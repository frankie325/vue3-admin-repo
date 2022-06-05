<template>
  <a-dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.realName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item v-if="getUseLockPage" key="lock">
          <template #icon>
            <Icon icon="ion:lock-closed-outline" />
          </template>
          <span>{{ t('layout.header.tooltipLock') }}</span>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="logout">
          <template #icon>
            <Icon icon="ion:power-outline" />
          </template>
          <span> {{ t('layout.header.dropdownItemLoginOut') }} </span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import Icon from '@/components/Icon';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useUserStore } from '@/store/modules/user';
  import { propTypes } from '@/utils/propTypes';
  import headerImg from '@/assets/images/avatar.jpg';

  type MenuEvent = 'logout' | 'lock';

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Icon,
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { t } = useI18n();

      const userStore = useUserStore();
      const { getUseLockPage } = useHeaderSetting();

      const getUserInfo = computed(() => {
        const { realName = '', avatar, desc } = userStore.getUserInfo || {};
        return { realName, avatar: avatar || headerImg, desc };
      });

      // 退出登录
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }

      function handleMenuClick(e: { key: MenuEvent }) {
        switch (e.key) {
          case 'logout':
            handleLoginOut();
            break;

          case 'lock':
            // handleLock();
            break;
        }
      }
      return {
        prefixCls,
        getUserInfo,
        getUseLockPage,
        t,
        handleMenuClick,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
