import * as migration_20260304_060421_add_search_columns from './20260304_060421_add_search_columns';
import * as migration_20260304_081845_add_phone_email_to_search from './20260304_081845_add_phone_email_to_search';

export const migrations = [
  {
    up: migration_20260304_060421_add_search_columns.up,
    down: migration_20260304_060421_add_search_columns.down,
    name: '20260304_060421_add_search_columns',
  },
  {
    up: migration_20260304_081845_add_phone_email_to_search.up,
    down: migration_20260304_081845_add_phone_email_to_search.down,
    name: '20260304_081845_add_phone_email_to_search'
  },
];
