import * as React from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownItemProps,
  DropdownSeparator,
  DropdownToggle,
  Flex,
  FlexItem,
  PageGroup,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  TabTitleText,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import cx from 'classnames';
import BreadCrumbs from '../../../shared/components/breadcrumbs/BreadCrumbs';
import { getQueryArgument, removeQueryArguments, setQueryArgument } from '../../../shared/utils';

import './DetailsPage.scss';

type Action = { type?: string; key: string; label: string } & DropdownItemProps;
type DetailsPageTabProps = {
  key: string;
  label: string;
  component: React.ReactNode;
  href?: string;
  isDisabled?: true;
  className?: string;
  isFilled?: boolean;
};

type DetailsPageProps = {
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  actions?: Action[];
  tabs: DetailsPageTabProps[];
  onTabSelect?: (selectedTabKey: string) => void;
};

const DetailsPage: React.FC<DetailsPageProps> = ({
  title,
  footer,
  description,
  breadcrumbs,
  actions = [],
  tabs = [],
  onTabSelect,
}) => {
  const tabMatched =
    tabs?.find((t) => t.key === getQueryArgument('activeTab'))?.key || tabs?.[0]?.key;
  const [activeTab, setActiveTab] = React.useState(tabMatched);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!tabMatched) {
      removeQueryArguments('activeTab');
    } else if (activeTab !== tabMatched) {
      setActiveTab(tabMatched);
    }
  }, [tabMatched, activeTab]);

  const dropdownItems = React.useMemo(
    () =>
      actions?.map((action) => {
        const { type, key, label, ...props } = action;
        return type === 'separator' ? (
          <DropdownSeparator key={key} />
        ) : (
          <DropdownItem key={key} {...props}>
            {label}
          </DropdownItem>
        );
      }),
    [actions],
  );

  const tabComponents = tabs?.map(({ key, label, component, isFilled = true, ...rest }) => {
    return (
      <Tab
        data-test={`details__tabItem ${key}`}
        key={key}
        eventKey={key}
        title={<TabTitleText>{label}</TabTitleText>}
        className={cx('hacbs-details__tabs__tabItem', { isFilled })}
        {...rest}
      >
        {component}
      </Tab>
    );
  });

  return (
    <PageGroup data-test="details">
      <PageSection type="breadcrumb">
        {breadcrumbs && <BreadCrumbs data-test="details__breadcrumbs" breadcrumbs={breadcrumbs} />}
        <Flex>
          <FlexItem>
            <TextContent>
              <Text component="h1" data-test="details__title">
                {title}
              </Text>
              {description && <Text component="p">{description}</Text>}
            </TextContent>
          </FlexItem>
          {actions?.length && (
            <FlexItem align={{ default: 'alignRight' }}>
              <Dropdown
                data-test="details__actions"
                position="right"
                toggle={
                  <DropdownToggle
                    onToggle={() => setIsOpen(!isOpen)}
                    toggleIndicator={CaretDownIcon}
                    isPrimary
                  >
                    Actions
                  </DropdownToggle>
                }
                onSelect={() => setIsOpen(!isOpen)}
                isOpen={isOpen}
                dropdownItems={dropdownItems}
              />
            </FlexItem>
          )}
        </Flex>
      </PageSection>
      {tabs?.length && (
        <PageSection className="hacbs-details__tabs" isFilled variant={PageSectionVariants.light}>
          <Tabs
            data-test="details__tabs"
            onSelect={(e, k: string) => {
              setQueryArgument('activeTab', k);
              setActiveTab(k);
              onTabSelect && onTabSelect(k);
            }}
            activeKey={activeTab}
          >
            {tabComponents}
          </Tabs>
        </PageSection>
      )}
      {footer && (
        <PageSection variant={PageSectionVariants.light} isFilled={false} sticky="bottom">
          {footer}
        </PageSection>
      )}
    </PageGroup>
  );
};

export default DetailsPage;
