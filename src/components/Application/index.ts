import { withInstall } from '@/utils';

import appProvider from './src/AppProvider.vue';
import appLocalePicker from './src/AppLocalePicker.vue';
import appDarkModeToggle from './src/AppDarkModeToggle.vue';

export const AppProvider = withInstall(appProvider);
export const AppLocalePicker = withInstall(appLocalePicker);
export const AppDarkModeToggle = withInstall(appDarkModeToggle);
