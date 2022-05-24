import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

export const TypePicker = createAsyncComponent(() => import('./TypePicker.vue'));
