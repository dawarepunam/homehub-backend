import type { Schema, Struct } from '@strapi/strapi';

export interface HeroHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_hero_hero_sections';
  info: {
    displayName: 'hero-section';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    badgeText: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    subHeading: Schema.Attribute.String;
  };
}

export interface HeroPopularSearch extends Struct.ComponentSchema {
  collectionName: 'components_hero_popular_searches';
  info: {
    displayName: 'popular-search';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface HeroSearchSection extends Struct.ComponentSchema {
  collectionName: 'components_hero_search_sections';
  info: {
    displayName: 'search-section';
  };
  attributes: {
    searchButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Search Properties'>;
    showLocalities: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showPopularSearch: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface HeroSearchTab extends Struct.ComponentSchema {
  collectionName: 'components_hero_search_tabs';
  info: {
    displayName: 'search-tab';
  };
  attributes: {
    isDefault: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface HomeAdviceTools extends Struct.ComponentSchema {
  collectionName: 'components_home_advice_tools';
  info: {
    displayName: 'AdviceTool';
  };
  attributes: {
    ButtonText: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    DisplayOrder: Schema.Attribute.Integer;
    Icon: Schema.Attribute.String;
    IsActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    Link: Schema.Attribute.String;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
    ToolType: Schema.Attribute.Enumeration<
      [
        'EMI Calculator',
        'Home Affordability',
        'Property Cost Calculator',
        'Home Loan Calculator',
      ]
    >;
  };
}

export interface HomeAdvicedTools extends Struct.ComponentSchema {
  collectionName: 'components_home_adviced_tools';
  info: {
    displayName: 'AdvicedTools';
  };
  attributes: {
    SectionLabel: Schema.Attribute.String;
    Subtitle: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
    Tools: Schema.Attribute.Component<'home.advice-tools', true>;
  };
}

export interface HomeFooter extends Struct.ComponentSchema {
  collectionName: 'components_home_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    BrandName: Schema.Attribute.String;
    CopyrightText: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    PropertyLinks: Schema.Attribute.Component<'home.property-links', true>;
    QuickLinks: Schema.Attribute.Component<'home.quick-links', true>;
    SocialLinks: Schema.Attribute.Component<'home.social-links', true>;
    SupportLinks: Schema.Attribute.Component<'home.support-links', true>;
  };
}

export interface HomeHeaderAction extends Struct.ComponentSchema {
  collectionName: 'components_home_header_actions';
  info: {
    displayName: 'HeaderAction';
  };
  attributes: {
    ActionType: Schema.Attribute.Enumeration<
      ['link', 'login', 'post-property']
    >;
    Icon: Schema.Attribute.String;
    IsHighlighted: Schema.Attribute.Boolean;
    Slug: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface HomeHeaderDropdownItem extends Struct.ComponentSchema {
  collectionName: 'components_home_header_dropdown_items';
  info: {
    displayName: 'HeaderDropdownItem';
  };
  attributes: {
    Description: Schema.Attribute.String;
    Icon: Schema.Attribute.String;
    Slug: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface HomeHeaderMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_home_header_menu_items';
  info: {
    displayName: 'HeaderMenuItem';
  };
  attributes: {
    DropdownItems: Schema.Attribute.Component<
      'home.header-dropdown-item',
      true
    >;
    HasDropdown: Schema.Attribute.Boolean;
    Icon: Schema.Attribute.String;
    Slug: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface HomeHomeHeader extends Struct.ComponentSchema {
  collectionName: 'components_home_home_headers';
  info: {
    displayName: 'HomeHeader';
  };
  attributes: {
    Brand: Schema.Attribute.String;
    HeaderActions: Schema.Attribute.Component<'home.header-action', true>;
    Logo: Schema.Attribute.Media<'images' | 'files'>;
    MenuItems: Schema.Attribute.Component<'home.header-menu-item', true>;
    Tagline: Schema.Attribute.String;
  };
}

export interface HomeHomeHero extends Struct.ComponentSchema {
  collectionName: 'components_home_home_heroes';
  info: {
    displayName: 'HomeHero';
  };
  attributes: {
    BackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    Heading: Schema.Attribute.String;
    MobileBackground: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    Search: Schema.Attribute.Component<'home.home-search', false>;
    SubHeading: Schema.Attribute.Text;
  };
}

export interface HomeHomeSearch extends Struct.ComponentSchema {
  collectionName: 'components_home_home_searches';
  info: {
    displayName: 'HomeSearch';
  };
  attributes: {
    AdvancedSearchText: Schema.Attribute.String;
    BudgetIcon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'wallet'>;
    BudgetPlaceholder: Schema.Attribute.String;
    LocationIcon: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'map-pin'>;
    LocationPlaceholder: Schema.Attribute.String;
    PropertyTypeIcon: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'home'>;
    PropertyTypePlaceholder: Schema.Attribute.String;
    Purpose: Schema.Attribute.Enumeration<['Buy', 'Rent', 'Commercial']> &
      Schema.Attribute.DefaultTo<'Buy'>;
    SearchButtonText: Schema.Attribute.String;
    SearchIcon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'search'>;
  };
}

export interface HomePopularLocationItem extends Struct.ComponentSchema {
  collectionName: 'components_home_popular_location_items';
  info: {
    displayName: 'PopularLocationItem';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    IsActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    Name: Schema.Attribute.String;
    Slug: Schema.Attribute.String;
  };
}

export interface HomePopularLocations extends Struct.ComponentSchema {
  collectionName: 'components_home_popular_locations';
  info: {
    displayName: 'PopularLocations';
  };
  attributes: {
    PopularLocationItem: Schema.Attribute.Component<
      'home.popular-location-item',
      true
    >;
    Subtitle: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface HomePropertyCategories extends Struct.ComponentSchema {
  collectionName: 'components_home_property_categories';
  info: {
    displayName: 'PropertyCategories';
  };
  attributes: {
    PropertyCategories: Schema.Attribute.Component<
      'home.property-category-item',
      true
    >;
    Subtitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface HomePropertyCategoryItem extends Struct.ComponentSchema {
  collectionName: 'components_home_property_category_items';
  info: {
    displayName: 'PropertyCategoryItem';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Icon: Schema.Attribute.String;
    IsActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    PropertyTypes: Schema.Attribute.String;
    Slug: Schema.Attribute.String;
    Text: Schema.Attribute.String;
  };
}

export interface HomePropertyGuide extends Struct.ComponentSchema {
  collectionName: 'components_home_property_guides';
  info: {
    displayName: 'PropertyGuide';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    DisplayOrder: Schema.Attribute.Integer;
    Icon: Schema.Attribute.String;
    IsActive: Schema.Attribute.Boolean;
    Link: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface HomePropertyLinks extends Struct.ComponentSchema {
  collectionName: 'components_home_property_links';
  info: {
    displayName: 'PropertyLinks';
  };
  attributes: {
    DisplayOrder: Schema.Attribute.Integer;
    IsActive: Schema.Attribute.Boolean;
    Link: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface HomeQuickLinks extends Struct.ComponentSchema {
  collectionName: 'components_home_quick_links';
  info: {
    displayName: 'QuickLinks';
  };
  attributes: {
    DisplayOrder: Schema.Attribute.Integer;
    IsActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    Link: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface HomeSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_home_social_links';
  info: {
    displayName: 'SocialLinks';
  };
  attributes: {
    DisplayOrder: Schema.Attribute.Integer;
    Icon: Schema.Attribute.String;
    IsActive: Schema.Attribute.Boolean;
    Link: Schema.Attribute.String;
    Platform: Schema.Attribute.String;
  };
}

export interface HomeSupportLinks extends Struct.ComponentSchema {
  collectionName: 'components_home_support_links';
  info: {
    displayName: 'SupportLinks';
  };
  attributes: {
    DisplayOrder: Schema.Attribute.Integer;
    IsActive: Schema.Attribute.Boolean;
    Link: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface HomeWhyChooseBenefit extends Struct.ComponentSchema {
  collectionName: 'components_home_why_choose_benefits';
  info: {
    displayName: 'WhyChooseBenefit';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    DisplayOrder: Schema.Attribute.Integer;
    Icon: Schema.Attribute.String;
    IsActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    ShortTitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface HomeWhyChooseHomeHub extends Struct.ComponentSchema {
  collectionName: 'components_home_why_choose_home_hubs';
  info: {
    displayName: 'WhyChooseHomeHub';
  };
  attributes: {
    Benefits: Schema.Attribute.Component<'home.why-choose-benefit', true>;
    SectionLabel: Schema.Attribute.String;
    Subtitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    displayName: 'header';
  };
  attributes: {
    Brand: Schema.Attribute.String;
    Logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    OwnerProfileMenu: Schema.Attribute.Component<
      'navigation.owner-profile-menu-item',
      true
    >;
    Search: Schema.Attribute.String;
  };
}

export interface LayoutUserHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_user_headers';
  info: {
    displayName: 'User Header';
  };
  attributes: {
    Brand: Schema.Attribute.String;
    DefaultLocation: Schema.Attribute.String;
    Logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    MenuItem: Schema.Attribute.Component<'navigation.menu-item', true>;
    ProfileMenu: Schema.Attribute.Component<
      'navigation.profile-menu-item',
      true
    >;
  };
}

export interface LayoutUserHero extends Struct.ComponentSchema {
  collectionName: 'components_layout_user_heroes';
  info: {
    displayName: 'User Hero';
  };
  attributes: {
    BackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    Heading: Schema.Attribute.String;
    MobileBackground: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    SubHeading: Schema.Attribute.Text;
    TrustedBadge: Schema.Attribute.String;
  };
}

export interface NavigationDropdownItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_dropdown_items';
  info: {
    displayName: 'DropdownItem';
  };
  attributes: {
    DisplayOrder: Schema.Attribute.Integer;
    IsActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    Purpose_type: Schema.Attribute.Enumeration<
      ['Buy', 'Rent', 'Sale', 'Lease']
    >;
    Slug: Schema.Attribute.String;
    Text: Schema.Attribute.String;
  };
}

export interface NavigationMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_menu_items';
  info: {
    displayName: 'MenuItem';
  };
  attributes: {
    DisplayOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<1>;
    DropdownItem: Schema.Attribute.Component<'navigation.dropdown-item', true>;
    HasDropdown: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    Icon: Schema.Attribute.String;
    Slug: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface NavigationOwnerProfileMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_owner_profile_menu_items';
  info: {
    displayName: 'OwnerProfileMenuItem';
  };
  attributes: {
    DisplayOrder: Schema.Attribute.Integer;
    Icon: Schema.Attribute.String;
    IsActive: Schema.Attribute.Boolean;
    Title: Schema.Attribute.String;
    Url: Schema.Attribute.String;
  };
}

export interface NavigationProfileMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_profile_menu_items';
  info: {
    displayName: 'Profile Menu Item';
  };
  attributes: {
    DisplayOrder: Schema.Attribute.Integer;
    Icon: Schema.Attribute.String;
    IsActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    Title: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface NavigationPropertyType extends Struct.ComponentSchema {
  collectionName: 'components_navigation_property_types';
  info: {
    displayName: 'PropertyType';
  };
  attributes: {
    DisplayOrder: Schema.Attribute.Integer;
    IsActive: Schema.Attribute.Boolean;
    Slug: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface OwnerOwnerDropdownItem extends Struct.ComponentSchema {
  collectionName: 'components_owner_owner_dropdown_items';
  info: {
    displayName: 'OwnerDropdownItem';
  };
  attributes: {
    DisplayOrder: Schema.Attribute.Integer;
    Icon: Schema.Attribute.String;
    IsActive: Schema.Attribute.Boolean;
    Title: Schema.Attribute.String;
    Url: Schema.Attribute.String;
  };
}

export interface OwnerOwnerHeader extends Struct.ComponentSchema {
  collectionName: 'components_owner_owner_headers';
  info: {
    displayName: 'OwnerHeader';
  };
  attributes: {
    Brand: Schema.Attribute.String;
    Logo: Schema.Attribute.Media<'images' | 'files'>;
    OwnerName: Schema.Attribute.String;
    OwnerNavItem: Schema.Attribute.Component<'owner.owner-nav-item', true>;
    OwnerRole: Schema.Attribute.String;
    Tagline: Schema.Attribute.String;
  };
}

export interface OwnerOwnerNavItem extends Struct.ComponentSchema {
  collectionName: 'components_owner_owner_nav_items';
  info: {
    displayName: 'OwnerNavItem';
  };
  attributes: {
    DisplayOrder: Schema.Attribute.Integer;
    Icon: Schema.Attribute.String;
    IsActive: Schema.Attribute.Boolean;
    OwnerDropdownItem: Schema.Attribute.Component<
      'owner.owner-dropdown-item',
      true
    >;
    Title: Schema.Attribute.String;
    Url: Schema.Attribute.String;
  };
}

export interface OwnerOwnerPropertyOverview extends Struct.ComponentSchema {
  collectionName: 'components_owner_owner_property_overviews';
  info: {
    displayName: 'OwnerPropertyOverview';
  };
  attributes: {
    Description: Schema.Attribute.String;
    Title: Schema.Attribute.String;
    ViewAllText: Schema.Attribute.String;
    ViewAllUrl: Schema.Attribute.String;
  };
}

export interface OwnerOwnerPropertyStats extends Struct.ComponentSchema {
  collectionName: 'components_owner_owner_property_stats';
  info: {
    displayName: 'OwnerPropertyStats';
  };
  attributes: {
    Icon: Schema.Attribute.String;
    IsActive: Schema.Attribute.Boolean;
    Label: Schema.Attribute.String;
    Value: Schema.Attribute.String;
  };
}

export interface OwnerOwnerQuickActions extends Struct.ComponentSchema {
  collectionName: 'components_owner_owner_quick_actions';
  info: {
    displayName: 'OwnerQuickAction';
  };
  attributes: {
    Description: Schema.Attribute.String;
    Icon: Schema.Attribute.String;
    IsActive: Schema.Attribute.Boolean;
    IsHighlighted: Schema.Attribute.Boolean;
    Title: Schema.Attribute.String;
    Url: Schema.Attribute.String;
  };
}

export interface OwnerOwnerQuickActionss extends Struct.ComponentSchema {
  collectionName: 'components_owner_owner_quick_actionsses';
  info: {
    displayName: 'OwnerQuickActionss';
  };
  attributes: {
    OwnerQuickAction: Schema.Attribute.Component<
      'owner.owner-quick-actions',
      true
    >;
  };
}

export interface OwnerOwnerRecentActivity extends Struct.ComponentSchema {
  collectionName: 'components_owner_owner_recent_activities';
  info: {
    displayName: 'OwnerRecentActivity';
  };
  attributes: {
    ActivityType: Schema.Attribute.String;
    Description: Schema.Attribute.String;
    Icon: Schema.Attribute.String;
    IsActive: Schema.Attribute.Boolean;
    Title: Schema.Attribute.String;
  };
}

export interface OwnerOwnerStats extends Struct.ComponentSchema {
  collectionName: 'components_owner_owner_stats';
  info: {
    displayName: 'OwnerStats';
  };
  attributes: {
    EnquiriesLabel: Schema.Attribute.String;
    PropertiesLabel: Schema.Attribute.String;
    SiteVisitsLabel: Schema.Attribute.String;
    ViewsLabel: Schema.Attribute.String;
  };
}

export interface OwnerOwnerWelcome extends Struct.ComponentSchema {
  collectionName: 'components_owner_owner_welcomes';
  info: {
    displayName: 'OwnerWelcome';
  };
  attributes: {
    EnquiryCountLabel: Schema.Attribute.String;
    Heading: Schema.Attribute.String;
    OwnerNameLabel: Schema.Attribute.String;
    OwnerRoleLabel: Schema.Attribute.String;
    PropertyCountLabel: Schema.Attribute.String;
    Subtitle: Schema.Attribute.Text;
    ViewCountLabel: Schema.Attribute.String;
  };
}

export interface ProfileProfileDetails extends Struct.ComponentSchema {
  collectionName: 'components_profile_profile_details';
  info: {
    displayName: 'Profile Details';
  };
  attributes: {
    Address: Schema.Attribute.Text;
    Bio: Schema.Attribute.Text;
    City: Schema.Attribute.String;
    Company: Schema.Attribute.String;
    CoverImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    DOB: Schema.Attribute.Date;
    FirstName: Schema.Attribute.String;
    Gender: Schema.Attribute.Enumeration<['Male', 'Female', 'Other']>;
    IsVerified: Schema.Attribute.Boolean;
    LastName: Schema.Attribute.String;
    Occupation: Schema.Attribute.String;
    Phone: Schema.Attribute.String;
    pincode: Schema.Attribute.String;
    ProfileImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    State: Schema.Attribute.String;
  };
}

export interface ProfileSettings extends Struct.ComponentSchema {
  collectionName: 'components_profile_settings';
  info: {
    displayName: 'Settings';
  };
  attributes: {
    Email_Notification: Schema.Attribute.Boolean;
    Push_Notification: Schema.Attribute.Boolean;
    SMS_Notification: Schema.Attribute.Boolean;
  };
}

export interface ProfileWishlist extends Struct.ComponentSchema {
  collectionName: 'components_profile_wishlists';
  info: {
    displayName: 'wishlist';
  };
  attributes: {
    properties: Schema.Attribute.Relation<
      'oneToMany',
      'api::property.property'
    >;
  };
}

export interface PromotionsPromotionPlan extends Struct.ComponentSchema {
  collectionName: 'components_promotions_promotion_plans';
  info: {
    description: 'Available promotion packages (e.g. 7-day boost)';
    displayName: 'PromotionPlan';
  };
  attributes: {
    benefits: Schema.Attribute.Text;
    creditsRequired: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<1>;
    durationDays: Schema.Attribute.Integer & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    isRecommended: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    promotionType: Schema.Attribute.Enumeration<
      ['boost', 'featured', 'highlight']
    > &
      Schema.Attribute.Required;
  };
}

export interface PromotionsSubscriptionPlan extends Struct.ComponentSchema {
  collectionName: 'components_promotions_subscription_plans';
  info: {
    description: 'A tiered subscription plan for owners';
    displayName: 'SubscriptionPlan';
  };
  attributes: {
    advancedAnalytics: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    benefits: Schema.Attribute.Text;
    billingCycle: Schema.Attribute.Enumeration<['monthly', 'yearly']> &
      Schema.Attribute.DefaultTo<'monthly'>;
    boostCredits: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    featuredCredits: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    highlightCredits: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    isPopular: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    maxActivePromotions: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<5>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    priorityVisibility: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    smartRecommendations: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface PropertyCommercialDetails extends Struct.ComponentSchema {
  collectionName: 'components_property_commercial_details';
  info: {
    displayName: 'Commercial Details';
  };
  attributes: {
    Cabins: Schema.Attribute.Integer;
    CommercialType: Schema.Attribute.Enumeration<
      ['Office', 'Shop', 'Showroom', 'Co-working Space', 'Commercial Land']
    >;
    MeetingRooms: Schema.Attribute.Integer;
    Pantry: Schema.Attribute.Boolean;
    ReceptionArea: Schema.Attribute.Boolean;
    Washrooms: Schema.Attribute.Integer;
  };
}

export interface PropertyFeature extends Struct.ComponentSchema {
  collectionName: 'components_property_features';
  info: {
    displayName: 'FeaturedProperties';
  };
  attributes: {
    properties: Schema.Attribute.Relation<
      'oneToMany',
      'api::property.property'
    >;
    SectionLabel: Schema.Attribute.String;
    Subtitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
    ViewAllLink: Schema.Attribute.String;
    ViewAllText: Schema.Attribute.String;
  };
}

export interface PropertyIndustrialDetails extends Struct.ComponentSchema {
  collectionName: 'components_property_industrial_details';
  info: {
    displayName: 'Industrial Details';
  };
  attributes: {
    CraneFacility: Schema.Attribute.Boolean;
    IndustrialType: Schema.Attribute.Enumeration<
      [
        'Warehouse',
        'Factory',
        'Industrial Shed',
        'Industrial Land',
        'Manufacturing Unit',
      ]
    >;
    LoadingDock: Schema.Attribute.Boolean;
    OfficeSpace: Schema.Attribute.Boolean;
    PowerSupply: Schema.Attribute.Enumeration<
      ['Single Phase', 'Three Phase', 'High Voltage']
    >;
    WarehouseArea: Schema.Attribute.Decimal;
  };
}

export interface PropertyPropertyAmenities extends Struct.ComponentSchema {
  collectionName: 'components_property_property_amenities';
  info: {
    displayName: 'Property Amenities';
  };
  attributes: {
    CCTV: Schema.Attribute.Boolean;
    ClubHouse: Schema.Attribute.Boolean;
    FireSafety: Schema.Attribute.Boolean;
    Garden: Schema.Attribute.Boolean;
    Gym: Schema.Attribute.Boolean;
    Lift: Schema.Attribute.Boolean;
    Parking: Schema.Attribute.Boolean;
    PowerBackup: Schema.Attribute.Boolean;
    Security: Schema.Attribute.Boolean;
    SwimmingPool: Schema.Attribute.Boolean;
    VisitorParking: Schema.Attribute.Boolean;
    WaterSupply: Schema.Attribute.Boolean;
  };
}

export interface PropertyPropertyOverview extends Struct.ComponentSchema {
  collectionName: 'components_property_property_overviews';
  info: {
    displayName: 'Property Overview';
  };
  attributes: {
    DisplayOrder: Schema.Attribute.Integer;
    Icon: Schema.Attribute.String;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
    Value: Schema.Attribute.String;
  };
}

export interface PropertyResidentialDetails extends Struct.ComponentSchema {
  collectionName: 'components_property_residential_details';
  info: {
    displayName: 'Residential Details';
  };
  attributes: {
    Balconies: Schema.Attribute.Integer;
    Bathrooms: Schema.Attribute.Integer;
    Bedrooms: Schema.Attribute.Enumeration<
      ['BHK 1', 'BHK 2', 'BHK 3', 'BHK 4', 'BHK 5+']
    >;
    FloorNo: Schema.Attribute.Integer;
    Furnishing: Schema.Attribute.Enumeration<
      ['Unfurnished', 'Semi Furnished', 'Fully Furnished']
    >;
    PropertyCondition: Schema.Attribute.Enumeration<
      ['New', 'Ready to Move', 'Under Construction', 'Resale', 'Upcoming']
    >;
    TotalFloors: Schema.Attribute.Integer;
  };
}

export interface PropertyResidentialRentDetails extends Struct.ComponentSchema {
  collectionName: 'components_property_residential_rent_details';
  info: {
    displayName: 'Property Common Details';
  };
  attributes: {
    Area_Unit: Schema.Attribute.Enumeration<
      ['Sq.ft', 'Sq.m', 'Acres', 'Guntha']
    >;
    AvailableForm: Schema.Attribute.Date & Schema.Attribute.Required;
    Built_upArea: Schema.Attribute.Decimal;
    CarpetArea: Schema.Attribute.Decimal & Schema.Attribute.Required;
    Facing: Schema.Attribute.Enumeration<
      [
        'East',
        'West',
        'North',
        'South',
        'North-East',
        'North-West',
        'South-East',
        'South-West',
      ]
    >;
    PropertyAge: Schema.Attribute.Enumeration<
      ['New ', 'Years 0-1', 'Years 1-5', 'Years 5-10', 'Years 10+']
    >;
  };
}

export interface ToolsEmiCalculator extends Struct.ComponentSchema {
  collectionName: 'components_tools_emi_calculators';
  info: {
    displayName: 'EMICalculator';
  };
  attributes: {
    CalculateButtonText: Schema.Attribute.String;
    DownPaymentLabel: Schema.Attribute.String;
    InterestRateLabel: Schema.Attribute.String;
    LoanAmountLabel: Schema.Attribute.String;
    LoanSummaryTitle: Schema.Attribute.String;
    LoanTenureLabel: Schema.Attribute.String;
    MonthlyEMILabel: Schema.Attribute.String;
    PrincipalInterestTitle: Schema.Attribute.String;
    PropertyPriceLabel: Schema.Attribute.String;
    Subtitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
    TotalInterestLabel: Schema.Attribute.String;
    TotalPaymentLabel: Schema.Attribute.String;
  };
}

export interface ToolsHomeAffordabilityCalculator
  extends Struct.ComponentSchema {
  collectionName: 'components_tools_home_affordability_calculators';
  info: {
    displayName: 'HomeAffordabilityCalculator';
  };
  attributes: {
    AffordableEMILabel: Schema.Attribute.String;
    CalculateButtonText: Schema.Attribute.String;
    DownPaymentLabel: Schema.Attribute.String;
    EstimatedLoanLabel: Schema.Attribute.String;
    ExistingEMILabel: Schema.Attribute.String;
    HomeBudgetLabel: Schema.Attribute.String;
    InterestRateLabel: Schema.Attribute.String;
    LoanTenureLabel: Schema.Attribute.String;
    MonthlyIncomeLabel: Schema.Attribute.String;
    RecommendedBudgetLabel: Schema.Attribute.String;
    ResultDescription: Schema.Attribute.String;
    Subtitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface ToolsHomeLoanEligibilityCalculator
  extends Struct.ComponentSchema {
  collectionName: 'components_tools_home_loan_eligibility_calculators';
  info: {
    displayName: 'HomeLoanEligibilityCalculator';
  };
  attributes: {
    CalculateButtonText: Schema.Attribute.String;
    DownPaymentLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Down Payment / Savings'>;
    EligibleLoanLabel: Schema.Attribute.String;
    ExistingEMILabel: Schema.Attribute.String;
    InterestRateLabel: Schema.Attribute.String;
    LoanTenureLabel: Schema.Attribute.String;
    MaximumEMILabel: Schema.Attribute.String;
    MonthlyIncomeLabel: Schema.Attribute.String;
    PropertyBudgetLabel: Schema.Attribute.String;
    ResultDescription: Schema.Attribute.String;
    Subtitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface ToolsPropertyCostCalculator extends Struct.ComponentSchema {
  collectionName: 'components_tools_property_cost_calculators';
  info: {
    displayName: 'PropertyCostCalculator';
  };
  attributes: {
    CalculateButtonText: Schema.Attribute.String;
    GSTLabel: Schema.Attribute.String;
    GSTResultLabel: Schema.Attribute.String;
    OtherChargesLabel: Schema.Attribute.String;
    OtherChargesResultLabel: Schema.Attribute.String;
    PropertyPriceLabel: Schema.Attribute.String;
    PropertyPriceResultLabel: Schema.Attribute.String;
    RegistrationLabel: Schema.Attribute.String;
    RegistrationResultLabel: Schema.Attribute.String;
    ResultDescription: Schema.Attribute.String;
    StampDutyLabel: Schema.Attribute.String;
    StampDutyResultLabel: Schema.Attribute.String;
    Subtitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
    TotalCostLabel: Schema.Attribute.String;
  };
}

export interface UserNotificationPreferences extends Struct.ComponentSchema {
  collectionName: 'components_user_notification_preferences';
  info: {
    displayName: 'Notification Preferences';
  };
  attributes: {
    DealUpdates: Schema.Attribute.Boolean;
    EmailNotifications: Schema.Attribute.Boolean;
    EnquiryUpdates: Schema.Attribute.Boolean;
    MarketingNotifications: Schema.Attribute.Boolean;
    NewPropertyAlerts: Schema.Attribute.Boolean;
    PropertyAlerts: Schema.Attribute.Boolean;
  };
}

export interface UserPrivacySettings extends Struct.ComponentSchema {
  collectionName: 'components_user_privacy_settings';
  info: {
    displayName: 'Privacy Settings';
  };
  attributes: {
    EmailAddress: Schema.Attribute.Boolean;
    OwnerContact: Schema.Attribute.Boolean;
    PhoneNumber: Schema.Attribute.Boolean;
    ProfileVisibility: Schema.Attribute.Boolean;
  };
}

export interface UserPropertyPreferences extends Struct.ComponentSchema {
  collectionName: 'components_user_property_preferences';
  info: {
    displayName: 'Property Preferences';
  };
  attributes: {
    BHK: Schema.Attribute.String;
    MaximumBudget: Schema.Attribute.Integer;
    MinimumBudget: Schema.Attribute.Integer;
    PreferredArea: Schema.Attribute.String;
    PreferredCategory: Schema.Attribute.String;
    PreferredCity: Schema.Attribute.String;
    PropertyType: Schema.Attribute.Enumeration<
      ['Residential', 'Commercial', 'Industrial']
    >;
    Purpose: Schema.Attribute.Enumeration<['Buy', 'Rent', 'Sale']>;
  };
}

export interface UserUserSettings extends Struct.ComponentSchema {
  collectionName: 'components_user_user_settings';
  info: {
    displayName: 'User Settings';
  };
  attributes: {
    Currency: Schema.Attribute.Enumeration<['INR', 'USD']>;
    DarkMode: Schema.Attribute.Boolean;
    Language: Schema.Attribute.Enumeration<['English', 'Marathi', 'Hindi']>;
    SaveSearchHistory: Schema.Attribute.Boolean;
    ShowRecentlyViewed: Schema.Attribute.Boolean;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'hero.hero-section': HeroHeroSection;
      'hero.popular-search': HeroPopularSearch;
      'hero.search-section': HeroSearchSection;
      'hero.search-tab': HeroSearchTab;
      'home.advice-tools': HomeAdviceTools;
      'home.adviced-tools': HomeAdvicedTools;
      'home.footer': HomeFooter;
      'home.header-action': HomeHeaderAction;
      'home.header-dropdown-item': HomeHeaderDropdownItem;
      'home.header-menu-item': HomeHeaderMenuItem;
      'home.home-header': HomeHomeHeader;
      'home.home-hero': HomeHomeHero;
      'home.home-search': HomeHomeSearch;
      'home.popular-location-item': HomePopularLocationItem;
      'home.popular-locations': HomePopularLocations;
      'home.property-categories': HomePropertyCategories;
      'home.property-category-item': HomePropertyCategoryItem;
      'home.property-guide': HomePropertyGuide;
      'home.property-links': HomePropertyLinks;
      'home.quick-links': HomeQuickLinks;
      'home.social-links': HomeSocialLinks;
      'home.support-links': HomeSupportLinks;
      'home.why-choose-benefit': HomeWhyChooseBenefit;
      'home.why-choose-home-hub': HomeWhyChooseHomeHub;
      'layout.header': LayoutHeader;
      'layout.user-header': LayoutUserHeader;
      'layout.user-hero': LayoutUserHero;
      'navigation.dropdown-item': NavigationDropdownItem;
      'navigation.menu-item': NavigationMenuItem;
      'navigation.owner-profile-menu-item': NavigationOwnerProfileMenuItem;
      'navigation.profile-menu-item': NavigationProfileMenuItem;
      'navigation.property-type': NavigationPropertyType;
      'owner.owner-dropdown-item': OwnerOwnerDropdownItem;
      'owner.owner-header': OwnerOwnerHeader;
      'owner.owner-nav-item': OwnerOwnerNavItem;
      'owner.owner-property-overview': OwnerOwnerPropertyOverview;
      'owner.owner-property-stats': OwnerOwnerPropertyStats;
      'owner.owner-quick-actions': OwnerOwnerQuickActions;
      'owner.owner-quick-actionss': OwnerOwnerQuickActionss;
      'owner.owner-recent-activity': OwnerOwnerRecentActivity;
      'owner.owner-stats': OwnerOwnerStats;
      'owner.owner-welcome': OwnerOwnerWelcome;
      'profile.profile-details': ProfileProfileDetails;
      'profile.settings': ProfileSettings;
      'profile.wishlist': ProfileWishlist;
      'promotions.promotion-plan': PromotionsPromotionPlan;
      'promotions.subscription-plan': PromotionsSubscriptionPlan;
      'property.commercial-details': PropertyCommercialDetails;
      'property.feature': PropertyFeature;
      'property.industrial-details': PropertyIndustrialDetails;
      'property.property-amenities': PropertyPropertyAmenities;
      'property.property-overview': PropertyPropertyOverview;
      'property.residential-details': PropertyResidentialDetails;
      'property.residential-rent-details': PropertyResidentialRentDetails;
      'tools.emi-calculator': ToolsEmiCalculator;
      'tools.home-affordability-calculator': ToolsHomeAffordabilityCalculator;
      'tools.home-loan-eligibility-calculator': ToolsHomeLoanEligibilityCalculator;
      'tools.property-cost-calculator': ToolsPropertyCostCalculator;
      'user.notification-preferences': UserNotificationPreferences;
      'user.privacy-settings': UserPrivacySettings;
      'user.property-preferences': UserPropertyPreferences;
      'user.user-settings': UserUserSettings;
    }
  }
}
