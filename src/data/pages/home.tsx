import { type ContentNavigationListProps } from '../../ui/design-system/src/lib/Components/ContentNavigationList';

const contentNavigationListItems: ContentNavigationListProps = {
  header: 'Key Features',
  contentNavigationItems: [
    {
      title: 'Why Flow',
      text: 'Introduction to the Network',
      link: '/build/flow',
      icon: 'learn',
    },
    {
      title: 'Account Abstraction',
      text: 'Enhance UX with a flexible Account structure and key management',
      link: '/build/advanced-concepts/account-abstraction',
      icon: 'learn',
    },
    {
      title: 'Account Linking',
      text: 'Seamless onboarding and secure resource ownership',
      link: '/build/guides/account-linking',
      icon: 'learn',
    },
    {
      title: 'Mobile',
      text: 'Build truly mobile first experiences',
      link: '/build/guides/mobile/overview',
      icon: 'tools',
    },
  ],
};

export { contentNavigationListItems };
