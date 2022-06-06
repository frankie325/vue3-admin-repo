<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent } from 'vue';
  import { usePermission } from '@/hooks/web/usePermission';
  import { getSlot } from '@/utils/helper/tsxHelper';
  import { RoleEnum } from '@/enums/roleEnum';

  export default defineComponent({
    name: 'Authority',
    props: {
      value: {
        type: [Number, Array, String] as PropType<RoleEnum | RoleEnum[] | string | string[]>,
        default: '',
      },
    },
    setup(props, { slots }) {
      const { hasPermission } = usePermission();

      /**
       * @description: 通过权限控制是否生成Authority包裹的节点
       */
      function renderAuth() {
        const { value } = props;
        if (!value) {
          return getSlot(slots);
        }

        return hasPermission(value) ? getSlot(slots) : null;
      }

      return () => {
        // Role-based value control
        return renderAuth();
      };
    },
  });
</script>
