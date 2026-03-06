export const MENU_CONSTANTS = {
  MODULE_NAME: 'Menu',
  TABLE_NAME: 'menus',
  
  VALIDATION: {
    NAME_MAX_LENGTH: 100,
    URL_MAX_LENGTH: 255,
    ICON_MAX_LENGTH: 50,
    MIN_ORDER: 0,
  },
  
  ERROR_MESSAGES: {
    NOT_FOUND: 'Menu not found',
    PARENT_NOT_FOUND: 'Parent menu not found',
    CIRCULAR_REFERENCE: 'Cannot move menu to its own descendant',
    INVALID_ORDER: 'Order must be a non-negative number',
  },
};
