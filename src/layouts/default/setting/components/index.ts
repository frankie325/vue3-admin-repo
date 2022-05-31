import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

export const TypePicker = createAsyncComponent(() => import('./TypePicker.vue'));
export const ThemeColorPicker = createAsyncComponent(() => import('./ThemeColorPicker.vue'));
export const SwitchItem = createAsyncComponent(() => import('./SwitchItem.vue'));
